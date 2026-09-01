# original vs clone · 克隆评估报告

## 结论
- 原站 URL: https://plxbrasil.com.br/
- 克隆 URL: http://localhost:8123/
- 自动推断复杂度: L6
- 复刻模式建议: 展示层视觉复刻
- 自动报告边界: 结构、数量、框架、console 可自动比；传入 visual-diff 后可纳入像素差异分。内容残留和法务仍需审计。

## 技术信号
| 项目 | 原站 | 克隆站 |
|---|---|---|
| title | Mini Escavadeiras, Carregadeiras e Dumpers | PLX Brasil | Mini Escavadeiras, Carregadeiras e Dumpers | PLX Brasil |
| lang | pt-br | pt-BR |
| frameworks | none | none |
| scrollHeight | 7275 | 6978 |
| h1 | Venda de Máquinas PLX | Venda de Máquinas PLX |

## 数量对比
| 指标 | 原站 | 克隆站 | 自动评分 |
|---|---:|---:|---:|
| sections | 32 | 36 | 4/5 |
| links | 84 | 56 | 3/5 |
| images | 64 | 65 | 5/5 |
| video | 0 | 0 | 5/5 |
| canvas | 0 | 0 | 5/5 |
| forms | 3 | 2 | 3/5 |
| buttons | 51 | 43 | 4/5 |
| inputs | 12 | 5 | 2/5 |
| interactive | 154 | 104 | 3/5 |
| scripts | 21 | 0 | 1/5 |

## 复刻评分
- 源证据: 3/5
- 结构保真: 5/5
- 视觉保真: 2/5
- 动效/交互: 5/5
- 响应式: 4/5
- 功能完整: 3/5
- 内容替换: 需人工看文案残留
- 法务/部署风险: 需人工核查 license / 素材

## Console
- 原站 console errors: 0
- 克隆 console errors: 0
- 原站 page errors: 0
- 克隆 page errors: 0

## 路由覆盖
- 原站路由: 25
- 克隆路由: 1
- 覆盖率: 4%
- 原站 route map: RECON/routes/original-route-map.json
- 克隆 route map: RECON/routes-clone/clone-route-map.json
- 缺失路由: /mini-escavadeira, /mini-escavadeira-x65-pro, /mini-escavadeira-x35-pro, /mini-escavadeira-x30-pro, /mini-escavadeira-x20-pro, /mini-escavadeira-x15-pro, /mini-escavadeira-x10-pro, /mini-escavadeira-x10-plus, /mini-carregadeira, /mini-carregadeira-xc750, /mini-carregadeira-xd500, /mini-dumper, /mini-dumper-xd500, /mini-rolo-compactador, /mini-rolo-compactador-xr12, /blog, /sobre, /contato, /suporte, /politica-de-cookies, /politica-de-privacidade, /nossos-servicos, /mini-escavadeira-forca-precisao-e-mobilidade-para-obras-e-servicos-tecnicos, /mini-dumper-o-equipamento-compacto-que-facilita-o-transporte-de-materiais
- 额外路由: 无


## 交互覆盖
- 原站可见交互目标: 80
- 克隆可见交互目标: 80
- 原站 canvas 目标: 0
- 克隆 canvas 目标: 0
- 原站 changed actions: 22/22
- 克隆 changed actions: 14/22
- 原站 interaction probe: RECON/interactions/original-interactions.json
- 克隆 interaction probe: RECON/interactions-clone/clone-interactions.json
- 判断: 交互数量信号不一致，需要检查缺失状态或过度实现。


## 截图证据
- 原站侦察: RECON/original-recon.json
- 克隆侦察: RECON/clone-recon.json
- 像素差异: RECON/visual-diff-1440.json
- 像素差异率: 0.19071038564337534
- 原站截图: screenshots/original-1440.png, screenshots/original-768.png, screenshots/original-390.png
- 克隆截图: screenshots/clone-1440.png, screenshots/clone-768.png, screenshots/clone-390.png

## 已知缺口
- 未传入 visual-diff 时，视觉保真需要打开截图人工确认。
- 法务、素材授权、品牌替换完整度需要人工核查。
