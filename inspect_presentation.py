import pptx

prs = pptx.Presentation('ppt_template.pptx')
with open('slides_structure.txt', 'w', encoding='utf-8') as f:
    f.write(f"Width: {prs.slide_width/914400:.2f} in, Height: {prs.slide_height/914400:.2f} in\n")
    for idx, slide in enumerate(prs.slides):
        f.write(f"\n==================== SLIDE {idx+1} ====================\n")
        for s_idx, shape in enumerate(slide.shapes):
            t = shape.text if shape.has_text_frame else "<no text>"
            t = t.replace('\x0b', '\n').strip()
            f.write(f"[{s_idx}] Name: {shape.name} | Type: {shape.shape_type} | Box: ({shape.left/914400:.2f}, {shape.top/914400:.2f}, {shape.width/914400:.2f}, {shape.height/914400:.2f})\n")
            if t:
                f.write(f"    Text: {t}\n")
print("Saved slides_structure.txt")
