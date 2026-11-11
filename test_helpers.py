import os
import pptx
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR

# -------------------------------------------------------------
# Color Palette (Matching Template: Gold/Ochre, Navy, Slate)
# -------------------------------------------------------------
C_NAVY_DARK   = RGBColor(15, 43, 72)     # #0F2B48 - Primary headings
C_NAVY_LIGHT  = RGBColor(30, 64, 105)    # #1E4069 - Secondary headings / badges
C_GOLD        = RGBColor(197, 155, 39)   # #C59B27 - Template gold accent
C_GOLD_LIGHT  = RGBColor(245, 238, 220)  # #F5EEDC - Card cream highlight
C_CARD_BG     = RGBColor(255, 255, 255)  # Pure white card background
C_CARD_BORDER = RGBColor(218, 204, 178)  # Subtle ochre/slate border
C_TEXT_DARK   = RGBColor(30, 41, 59)     # Slate 900
C_TEXT_MUTED  = RGBColor(71, 85, 105)    # Slate 600
C_GREEN_PASS  = RGBColor(22, 128, 61)    # Green 700
C_BLUE_BADGE  = RGBColor(37, 99, 235)    # Blue 600

def create_card(slide, left, top, width, height, bg_color=C_CARD_BG, border_color=C_CARD_BORDER, border_width=1.0):
    """Creates a rounded rectangle card container for clean grouping"""
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = bg_color
    if border_color:
        shape.line.color.rgb = border_color
        shape.line.width = Pt(border_width)
    else:
        shape.line.fill.background()
    return shape

def add_header_badge(shape, title, badge_text="", font_size=15):
    """Adds a stylish header with optional category badge"""
    tf = shape.text_frame
    tf.word_wrap = True
    tf.margin_left = Pt(12)
    tf.margin_right = Pt(12)
    tf.margin_top = Pt(10)
    tf.margin_bottom = Pt(8)
    
    p = tf.paragraphs[0]
    p.text = title.upper()
    p.font.name = "Segoe UI"
    p.font.size = Pt(font_size)
    p.font.bold = True
    p.font.color.rgb = C_NAVY_DARK
    p.space_after = Pt(8)
    return tf

def add_bullet_point(tf, title, desc, title_color=C_NAVY_LIGHT, desc_color=C_TEXT_DARK, title_size=11.5, desc_size=10.5, space_after=6):
    """Adds a bold-lead bullet point with clear hierarchy"""
    p = tf.add_paragraph()
    p.space_after = Pt(space_after)
    p.level = 0
    
    run_bullet = p.add_run()
    run_bullet.text = "▪ "
    run_bullet.font.name = "Segoe UI"
    run_bullet.font.size = Pt(title_size)
    run_bullet.font.bold = True
    run_bullet.font.color.rgb = C_GOLD
    
    if title:
        run_title = p.add_run()
        run_title.text = title + ": "
        run_title.font.name = "Segoe UI"
        run_title.font.size = Pt(title_size)
        run_title.font.bold = True
        run_title.font.color.rgb = title_color
        
    run_desc = p.add_run()
    run_desc.text = desc
    run_desc.font.name = "Segoe UI"
    run_desc.font.size = Pt(desc_size)
    run_desc.font.color.rgb = desc_color

def clear_shape_text(shape):
    """Clears text from an existing placeholder shape"""
    if shape.has_text_frame:
        shape.text = ""

def remove_shape_fill_and_line(shape):
    """Makes a shape completely transparent"""
    shape.fill.background()
    shape.line.fill.background()

print("Helper functions defined successfully.")
