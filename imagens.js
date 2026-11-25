// Separa os 36 produtos da imagem "imagens30.png" (grade 6x6) em arquivos
// individuais na pasta img/, que é servida pela API.
// Rodar uma vez antes de iniciar a API: npm run imagens
// A imagem original também fica no projeto, junto da pasta img/ gerada.

const fs = require("fs")
const path = require("path")
const zlib = require("zlib")

const IMAGEM_ORIGEM = "imagens30.png"
const PASTA_DESTINO = "img"

// Nome do arquivo local de cada produto (mesmo caminho_img salvo no banco)
const COLUNAS = 6
const LINHAS = 6
const NOMES_LOCAIS = Array.from(
    { length: COLUNAS * LINHAS },
    (_, i) => "produto-" + String(i + 1).padStart(2, "0") + ".png"
)

const LADO = 600
const MARGEM = 24

// ---------------------------------------------------------------------------
// Leitura e escrita de PNG (sem dependências externas)
// ---------------------------------------------------------------------------

const TABELA_CRC = (function () {
    const tabela = new Int32Array(256)
    for (let n = 0; n < 256; n++) {
        let c = n
        for (let k = 0; k < 8; k++) {
            c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1)
        }
        tabela[n] = c
    }
    return tabela
})()

function crc32(buffer) {
    let c = 0xffffffff
    for (let i = 0; i < buffer.length; i++) {
        c = TABELA_CRC[(c ^ buffer[i]) & 0xff] ^ (c >>> 8)
    }
    return (c ^ 0xffffffff) >>> 0
}

function bloco_png(tipo, dados) {
    const tamanho = Buffer.alloc(4)
    tamanho.writeUInt32BE(dados.length, 0)

    const tipo_e_dados = Buffer.concat([Buffer.from(tipo, "ascii"), dados])

    const crc = Buffer.alloc(4)
    crc.writeUInt32BE(crc32(tipo_e_dados), 0)

    return Buffer.concat([tamanho, tipo_e_dados, crc])
}

function ler_png(caminho) {
    const buffer = fs.readFileSync(caminho)

    const assinatura = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
    if (!buffer.subarray(0, 8).equals(assinatura)) {
        throw new Error(caminho + " não é um arquivo PNG válido")
    }

    let posicao = 8
    let ihdr = null
    const idat = []

    while (posicao < buffer.length) {
        const tamanho = buffer.readUInt32BE(posicao)
        const tipo = buffer.toString("ascii", posicao + 4, posicao + 8)
        const dados = buffer.subarray(posicao + 8, posicao + 8 + tamanho)
        posicao += 12 + tamanho

        if (tipo === "IHDR") {
            ihdr = {
                largura: dados.readUInt32BE(0),
                altura: dados.readUInt32BE(4),
                profundidade: dados[8],
                cor: dados[9],
                compressao: dados[10],
                filtro: dados[11],
                entrelacado: dados[12]
            }
        } else if (tipo === "IDAT") {
            idat.push(dados)
        } else if (tipo === "IEND") {
            break
        }
    }

    if (!ihdr) {
        throw new Error("PNG sem cabeçalho IHDR: " + caminho)
    }
    if (ihdr.profundidade !== 8 || (ihdr.cor !== 2 && ihdr.cor !== 6) || ihdr.entrelacado !== 0) {
        throw new Error("Formato de PNG não suportado: " + caminho)
    }

    const canais = ihdr.cor === 6 ? 4 : 3
    const bytes_por_linha = ihdr.largura * canais
    const cru = zlib.inflateSync(Buffer.concat(idat))
    const dados = Buffer.alloc(bytes_por_linha * ihdr.altura)

    let p = 0
    for (let y = 0; y < ihdr.altura; y++) {
        const filtro = cru[p++]
        const linha = dados.subarray(y * bytes_por_linha, (y + 1) * bytes_por_linha)
        const anterior = y > 0
            ? dados.subarray((y - 1) * bytes_por_linha, y * bytes_por_linha)
            : Buffer.alloc(bytes_por_linha)

        for (let x = 0; x < bytes_por_linha; x++) {
            const valor = cru[p++]
            const a = x >= canais ? linha[x - canais] : 0
            const b = anterior[x]
            const c = x >= canais ? anterior[x - canais] : 0

            if (filtro === 0) {
                linha[x] = valor
            } else if (filtro === 1) {
                linha[x] = (valor + a) & 255
            } else if (filtro === 2) {
                linha[x] = (valor + b) & 255
            } else if (filtro === 3) {
                linha[x] = (valor + ((a + b) >> 1)) & 255
            } else if (filtro === 4) {
                const pa = Math.abs(b - c)
                const pb = Math.abs(a - c)
                const pc = Math.abs(a + b - 2 * c)
                const preditor = (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c)
                linha[x] = (valor + preditor) & 255
            } else {
                throw new Error("Filtro de PNG inválido: " + filtro)
            }
        }
    }

    return { largura: ihdr.largura, altura: ihdr.altura, canais: canais, dados: dados }
}

function escrever_png(caminho, largura, altura, rgb) {
    const bytes_por_linha = largura * 3
    const cru = Buffer.alloc((bytes_por_linha + 1) * altura)

    for (let y = 0; y < altura; y++) {
        const inicio = y * (bytes_por_linha + 1)
        cru[inicio] = 0 // filtro "None"
        for (let x = 0; x < bytes_por_linha; x++) {
            cru[inicio + 1 + x] = rgb[y * bytes_por_linha + x]
        }
    }

    const ihdr = Buffer.alloc(13)
    ihdr.writeUInt32BE(largura, 0)
    ihdr.writeUInt32BE(altura, 4)
    ihdr[8] = 8   // profundidade
    ihdr[9] = 2   // RGB
    ihdr[10] = 0  // compressão
    ihdr[11] = 0  // filtro
    ihdr[12] = 0  // sem entrelaçamento

    fs.writeFileSync(caminho, Buffer.concat([
        Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
        bloco_png("IHDR", ihdr),
        bloco_png("IDAT", zlib.deflateSync(cru)),
        bloco_png("IEND", Buffer.alloc(0))
    ]))
}

// ---------------------------------------------------------------------------
// Utilidades de pixel
// ---------------------------------------------------------------------------

function eh_branco(imagem, x, y, limiar) {
    const o = (y * imagem.largura + x) * imagem.canais
    return imagem.dados[o] > limiar
        && imagem.dados[o + 1] > limiar
        && imagem.dados[o + 2] > limiar
}

function cor_do_pixel(imagem, x, y) {
    x = Math.min(imagem.largura - 1, Math.max(0, x))
    y = Math.min(imagem.altura - 1, Math.max(0, y))
    const o = (y * imagem.largura + x) * imagem.canais
    return [imagem.dados[o], imagem.dados[o + 1], imagem.dados[o + 2]]
}

function cor_interpolada(imagem, x, y) {
    const x0 = Math.floor(x)
    const y0 = Math.floor(y)
    const x1 = Math.min(imagem.largura - 1, x0 + 1)
    const y1 = Math.min(imagem.altura - 1, y0 + 1)
    const fx = x - x0
    const fy = y - y0

    const p00 = cor_do_pixel(imagem, x0, y0)
    const p10 = cor_do_pixel(imagem, x1, y0)
    const p01 = cor_do_pixel(imagem, x0, y1)
    const p11 = cor_do_pixel(imagem, x1, y1)

    const cor = [0, 0, 0]
    for (let c = 0; c < 3; c++) {
        const cima = p00[c] * (1 - fx) + p10[c] * fx
        const baixo = p01[c] * (1 - fx) + p11[c] * fx
        cor[c] = Math.round(cima * (1 - fy) + baixo * fy)
    }
    return cor
}

function faixas_de_conteudo(contagens, minimo, largura_minima) {
    const faixas = []
    let inicio = null

    for (let i = 0; i < contagens.length; i++) {
        if (contagens[i] > minimo && inicio === null) {
            inicio = i
        } else if (contagens[i] <= minimo && inicio !== null) {
            faixas.push([inicio, i - 1])
            inicio = null
        }
    }
    if (inicio !== null) {
        faixas.push([inicio, contagens.length - 1])
    }

    return faixas.filter(faixa => faixa[1] - faixa[0] >= largura_minima)
}

// Remove restos finos de produtos vizinhos que encostam na borda do recorte
// (por exemplo, a alça de um despertador ou a haste de um óculos).
function refinar_caixa(mascara, largura_imagem, caixa) {
    const { bx0, bx1, by0, by1 } = caixa
    const largura = bx1 - bx0
    const altura = by1 - by0
    const visto = new Uint8Array(largura * altura)
    const componentes = []

    for (let y = 0; y < altura; y++) {
        for (let x = 0; x < largura; x++) {
            const indice = y * largura + x
            if (visto[indice] || !mascara[(by0 + y) * largura_imagem + (bx0 + x)]) {
                continue
            }

            const pilha = [indice]
            visto[indice] = 1
            let area = 0
            let menor_x = x, maior_x = x, menor_y = y, maior_y = y

            while (pilha.length > 0) {
                const atual = pilha.pop()
                const ax = atual % largura
                const ay = Math.floor(atual / largura)
                area++

                if (ax < menor_x) menor_x = ax
                if (ax > maior_x) maior_x = ax
                if (ay < menor_y) menor_y = ay
                if (ay > maior_y) maior_y = ay

                const vizinhos = [
                    [ax - 1, ay], [ax + 1, ay],
                    [ax, ay - 1], [ax, ay + 1]
                ]
                for (const [vx, vy] of vizinhos) {
                    if (vx < 0 || vy < 0 || vx >= largura || vy >= altura) continue
                    const vi = vy * largura + vx
                    if (visto[vi]) continue
                    if (!mascara[(by0 + vy) * largura_imagem + (bx0 + vx)]) continue
                    visto[vi] = 1
                    pilha.push(vi)
                }
            }

            componentes.push({ area, menor_x, maior_x, menor_y, maior_y })
        }
    }

    if (componentes.length === 0) {
        return caixa
    }

    const maior_area = Math.max(...componentes.map(c => c.area))
    const relevantes = componentes.filter(c => {
        const altura_componente = c.maior_y - c.menor_y + 1
        const area_minima = Math.max(30, maior_area * 0.05)

        // Descarta riscos finos de produtos vizinhos que sobraram na borda
        if (altura_componente <= 25 && c.area < maior_area * 0.25) {
            return false
        }

        return c.area >= area_minima
    })

    let menor_x = Infinity, maior_x = -Infinity
    let menor_y = Infinity, maior_y = -Infinity
    for (const c of relevantes) {
        if (c.menor_x < menor_x) menor_x = c.menor_x
        if (c.maior_x > maior_x) maior_x = c.maior_x
        if (c.menor_y < menor_y) menor_y = c.menor_y
        if (c.maior_y > maior_y) maior_y = c.maior_y
    }

    return {
        bx0: bx0 + menor_x,
        bx1: bx0 + maior_x + 1,
        by0: by0 + menor_y,
        by1: by0 + maior_y + 1
    }
}

// Cada coluna da arte tem os 6 produtos distribuídos em alturas diferentes.
// Por isso descobrimos as faixas de cada coluna separadamente e recortamos
// cada produto pelo seu próprio conteúdo, sem cortar os vizinhos.
function detectar_caixas(imagem) {
    const LIMIAR = 232
    const { largura, altura } = imagem

    // 1 = pixel de produto, 0 = fundo claro
    const mascara = new Uint8Array(largura * altura)
    for (let y = 0; y < altura; y++) {
        for (let x = 0; x < largura; x++) {
            mascara[y * largura + x] = eh_branco(imagem, x, y, LIMIAR) ? 0 : 1
        }
    }

    // Colunas: a projeção vertical separa os 6 produtos lado a lado
    const contagem_colunas = new Int32Array(largura)
    for (let y = 0; y < altura; y++) {
        for (let x = 0; x < largura; x++) {
            if (mascara[y * largura + x]) {
                contagem_colunas[x]++
            }
        }
    }

    let colunas = faixas_de_conteudo(contagem_colunas, 2, 3)

    if (colunas.length !== COLUNAS) {
        // Se a imagem mudar, cai no recorte em partes iguais
        colunas = Array.from({ length: COLUNAS }, (_, c) => [
            Math.round(c * largura / COLUNAS),
            Math.round((c + 1) * largura / COLUNAS) - 1
        ])
    }

    const caixas = Array.from({ length: LINHAS }, () => Array(COLUNAS).fill(null))

    colunas.forEach(([x0, x1], coluna) => {
        // Linhas desta coluna
        const contagem_linhas = new Int32Array(altura)
        for (let y = 0; y < altura; y++) {
            let total = 0
            for (let x = x0; x <= x1; x++) {
                if (mascara[y * largura + x]) {
                    total++
                }
            }
            contagem_linhas[y] = total
        }

        // Procura os 5 melhores pontos de corte perto da divisão esperada
        const divisoes = [0]
        for (let i = 1; i < LINHAS; i++) {
            const esperado = Math.round(i * altura / LINHAS)
            const janela = 70
            const inicio_janela = Math.max(divisoes[divisoes.length - 1] + 35, esperado - janela)
            const fim_janela = Math.min(altura - 1, esperado + janela)

            let melhor = inicio_janela
            for (let y = inicio_janela; y <= fim_janela; y++) {
                if (contagem_linhas[y] < contagem_linhas[melhor]) {
                    melhor = y
                }
            }
            divisoes.push(Math.max(melhor, divisoes[divisoes.length - 1] + 1))
        }
        divisoes.push(altura)

        for (let linha = 0; linha < LINHAS; linha++) {
            const y0 = divisoes[linha]
            const y1 = divisoes[linha + 1]

            let bx0 = x0 + 2
            let bx1 = x1 - 2
            let by0 = y0 + 2
            let by1 = y1 - 2

            let menor_x = bx1
            let maior_x = bx0
            let menor_y = by1
            let maior_y = by0

            for (let y = by0; y < by1; y++) {
                for (let x = bx0; x < bx1; x++) {
                    if (mascara[y * largura + x]) {
                        if (x < menor_x) menor_x = x
                        if (x > maior_x) maior_x = x
                        if (y < menor_y) menor_y = y
                        if (y > maior_y) maior_y = y
                    }
                }
            }

            if (maior_x >= menor_x && maior_y >= menor_y) {
                bx0 = menor_x
                bx1 = maior_x + 1
                by0 = menor_y
                by1 = maior_y + 1
            }

            caixas[linha][coluna] = refinar_caixa(
                mascara,
                largura,
                { bx0, bx1, by0, by1 }
            )
        }
    })

    return caixas
}

// ---------------------------------------------------------------------------
// Separação dos produtos
// ---------------------------------------------------------------------------

function separar_imagens() {
    if (!fs.existsSync(PASTA_DESTINO)) {
        fs.mkdirSync(PASTA_DESTINO)
    }

    if (!fs.existsSync(IMAGEM_ORIGEM)) {
        const faltando = NOMES_LOCAIS.filter(nome => !fs.existsSync(path.join(PASTA_DESTINO, nome)))
        if (faltando.length === 0) {
            console.log("As 36 imagens já estão em " + PASTA_DESTINO + "/.")
            return
        }
        throw new Error(
            "Arquivo " + IMAGEM_ORIGEM + " não encontrado. " +
            "Coloque a imagem com a grade dos 36 produtos na raiz do projeto."
        )
    }

    console.log("Lendo " + IMAGEM_ORIGEM + "...")
    const imagem = ler_png(IMAGEM_ORIGEM)
    const caixas = detectar_caixas(imagem)

    const alvo = LADO - 2 * MARGEM

    for (let linha = 0; linha < LINHAS; linha++) {
        for (let coluna = 0; coluna < COLUNAS; coluna++) {
            const { bx0, bx1, by0, by1 } = caixas[linha][coluna]

            const largura_produto = bx1 - bx0
            const altura_produto = by1 - by0
            const escala = Math.min(alvo / largura_produto, alvo / altura_produto)
            const largura_destino = Math.max(1, Math.round(largura_produto * escala))
            const altura_destino = Math.max(1, Math.round(altura_produto * escala))

            // Tela branca quadrada com o produto centralizado
            const tela = Buffer.alloc(LADO * LADO * 3, 255)
            const deslocamento_x = Math.floor((LADO - largura_destino) / 2)
            const deslocamento_y = Math.floor((LADO - altura_destino) / 2)

            for (let dy = 0; dy < altura_destino; dy++) {
                for (let dx = 0; dx < largura_destino; dx++) {
                    const sx = bx0 + (dx + 0.5) * largura_produto / largura_destino - 0.5
                    const sy = by0 + (dy + 0.5) * altura_produto / altura_destino - 0.5
                    const cor = cor_interpolada(imagem, sx, sy)

                    const px = deslocamento_x + dx
                    const py = deslocamento_y + dy
                    const o = (py * LADO + px) * 3
                    tela[o] = cor[0]
                    tela[o + 1] = cor[1]
                    tela[o + 2] = cor[2]
                }
            }

            const numero = linha * COLUNAS + coluna + 1
            const nome = "produto-" + String(numero).padStart(2, "0") + ".png"
            const destino = path.join(PASTA_DESTINO, nome)

            escrever_png(destino, LADO, LADO, tela)
            console.log("Imagem salva: " + destino)
        }
    }

    console.log("As 36 imagens foram separadas em " + PASTA_DESTINO + "/!")
}

try {
    separar_imagens()
} catch (error) {
    console.log(error.message)
    process.exit(1)
}
