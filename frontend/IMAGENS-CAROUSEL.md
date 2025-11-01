# 🖼️ Guia de Imagens do Carrossel

## Imagens Atuais (Unsplash)

### Slide 1 - Vistoria Cautelar
**URL:** `https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1920&q=80`
**Descrição:** Mecânico vistoriando carro - profissional com prancheta
**Cor de fallback:** `#4f46e5` (Azul Índigo)

### Slide 2 - Vistoria Transferência
**URL:** `https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&q=80`
**Descrição:** Documentação e assinatura - pessoa assinando papéis
**Cor de fallback:** `#3b82f6` (Azul Médio)

### Slide 3 - Desconto Especial
**URL:** `https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1920&q=80`
**Descrição:** Pessoa feliz com carro novo - cliente satisfeito
**Cor de fallback:** `#6366f1` (Azul Índigo)

### Slide 4 - Vistoria Completa
**URL:** `https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1920&q=80`
**Descrição:** Mecânico profissional trabalhando - serviço técnico
**Cor de fallback:** `#0ea5e9` (Azul Céu)

---

## 🎨 Sobreposição Azul

Todas as imagens têm uma sobreposição de gradiente azul com opacidades entre 70-75%:

```css
background: linear-gradient(
  135deg,
  rgba(99, 102, 241, 0.75) 0%,    /* Azul Índigo */
  rgba(59, 130, 246, 0.70) 50%,   /* Azul Médio */
  rgba(79, 70, 229, 0.75) 100%    /* Azul Royal */
);
```

Isso garante:
- ✅ Texto sempre legível em branco
- ✅ Identidade visual azul mantida
- ✅ Profissionalismo e elegância

---

## 🔄 Como Trocar as Imagens

### Opção 1: Usar outras imagens do Unsplash
1. Acesse [unsplash.com](https://unsplash.com)
2. Busque por: "car inspection", "mechanic", "automotive"
3. Copie o ID da foto (exemplo: `photo-1619642751034-765dfdf7c58e`)
4. Use o formato: `https://images.unsplash.com/photo-SEU_ID_AQUI?w=1920&q=80`

### Opção 2: Usar imagens próprias
1. Coloque suas imagens na pasta `frontend/public/images/`
2. Edite o arquivo `frontend/src/styles/main.css` (linhas 64-101)
3. Substitua as URLs por: `url('/images/sua-imagem.jpg')`

**Exemplo:**
```css
.carousel-slide[data-bg="gradient-1"] {
  background-color: #4f46e5;
  background-image: url('/images/vistoria-cautelar.jpg');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
```

### Opção 3: Usar outros serviços gratuitos
- **Pexels:** `https://www.pexels.com/`
- **Pixabay:** `https://pixabay.com/`
- **Freepik:** `https://www.freepik.com/`

---

## 📱 Responsividade

Em mobile (< 768px), o `background-attachment: fixed` é automaticamente convertido para `scroll` para melhor performance.

---

## 💡 Dicas para Melhores Imagens

✅ **Resolução recomendada:** 1920x1080 ou maior
✅ **Formato:** JPG ou WebP (melhor compressão)
✅ **Conteúdo:** Imagens com foco no tema (carros, mecânicos, documentos)
✅ **Iluminação:** Prefira imagens bem iluminadas (a sobreposição escurece um pouco)
✅ **Composição:** Deixe espaço no centro para o texto ficar legível

---

## 🎯 Arquivo de Configuração

**Localização:** `frontend/src/styles/main.css`
**Linhas:** 64 a 101 (Background Images)
**Linhas:** 103 a 111 (Overlay azul)
