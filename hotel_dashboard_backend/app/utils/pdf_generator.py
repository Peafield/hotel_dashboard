import os
from fpdf import FPDF
from datetime import datetime
from app.models.room import Room
from app.utils.file_handler import UPLOAD_DIR
from PIL import Image as PILImage

COLOR_WHITE = (255, 255, 255)
COLOR_LIGHT_GRAY = (229, 231, 235)
COLOR_ACCENT_TAN = (191, 184, 176)
COLOR_RED = (255, 87, 87)
COLOR_DARK_GRAY = (59, 59, 59)
COLOR_HEADER_BG = COLOR_DARK_GRAY
COLOR_BODY_TEXT = COLOR_DARK_GRAY

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
ASSETS_DIR = os.path.join(BASE_DIR, "assets")
FONT_DIR = os.path.join(ASSETS_DIR, "fonts")
IMAGE_ASSETS_DIR = os.path.join(ASSETS_DIR, "images")
UPLOAD_DIR = os.path.join(BASE_DIR, "uploaded_images")
PDF_OUTPUT_DIR = os.path.join(BASE_DIR, "generated_pdfs")

KARLA_MEDIUM_PATH = os.path.join(FONT_DIR, "Karla-Medium.ttf")
MERRIWEATHER_REGULAR_PATH = os.path.join(FONT_DIR, "Merriweather-Regular.ttf")

LOGO_PATH = os.path.join(IMAGE_ASSETS_DIR, "hugo_logo.png")


class RoomPDF(FPDF):
    def footer(self):
        footer_rect_height = 14
        footer_rect_y = self.h - footer_rect_height
        self.set_fill_color(*COLOR_ACCENT_TAN)
        self.rect(0, footer_rect_y, self.w, footer_rect_height, "F")

        text_cell_height = 5
        padding_above = (footer_rect_height - text_cell_height) / 2
        text_y_from_bottom = padding_above + text_cell_height
        self.set_y(-text_y_from_bottom)

        try:
            self.set_font("Merriweather", "", 8)
        except RuntimeError:
            self.set_font("Helvetica", "", 8)
        self.set_text_color(*COLOR_BODY_TEXT)

        page_width = self.w - self.l_margin - self.r_margin

        self.cell(page_width / 2, text_cell_height, "© The Hugo 2025", 0, 0, "L")
        gen_date_str = datetime.now().strftime("%d/%m/%y")
        self.cell(page_width / 2, text_cell_height, gen_date_str, 0, 0, "R")


def add_custom_fonts(pdf: FPDF):
    fonts_loaded = True
    try:
        pdf.add_font("Karla", "B", KARLA_MEDIUM_PATH, uni=True)
        pdf.add_font("Merriweather", "", MERRIWEATHER_REGULAR_PATH, uni=True)
        print("[PDF Gen] Custom static fonts added successfully.")
    except Exception as e:
        print(f"[PDF Gen] ERROR adding custom fonts (check static paths exist): {e}")
        print(f"Font directory checked: {FONT_DIR}")
        print(f"Paths checked: {KARLA_MEDIUM_PATH}, {MERRIWEATHER_REGULAR_PATH}")
        print("[PDF Gen] Falling back to Helvetica.")
        fonts_loaded = False
    return fonts_loaded


def generate_room_pdf(room: Room):
    print(f"[PDF Gen] Generating styled PDF for Room ID: {room.id}")
    os.makedirs(PDF_OUTPUT_DIR, exist_ok=True)

    pdf = RoomPDF("P", "mm", "A4")
    pdf.set_auto_page_break(auto=True, margin=15)

    fonts_added = add_custom_fonts(pdf)
    title_font_family = "Karla" if fonts_added else "Helvetica"
    text_font_family = "Merriweather" if fonts_added else "Helvetica"

    pdf.add_page()
    full_page_width = pdf.w

    # --- Header ---
    header_height = 22
    pdf.set_fill_color(*COLOR_HEADER_BG)
    pdf.set_text_color(*COLOR_WHITE)
    pdf.rect(0, 0, full_page_width, header_height, "F")

    # --- Logo ---
    logo_x_mm = 10
    logo_y_mm = 6
    logo_h_mm = 11.5
    if os.path.exists(LOGO_PATH):
        try:
            pdf.image(LOGO_PATH, x=logo_x_mm, y=logo_y_mm, h=logo_h_mm, w=0)
        except Exception as logo_err:
            print(f"[PDF Gen] Error adding logo: {logo_err}")
            pdf.set_xy(logo_x_mm, logo_y_mm)
            pdf.set_font(title_font_family, "B", 10)
            pdf.cell(20, logo_h_mm, "(Logo Err)")
    elif not os.path.exists(LOGO_PATH):
        print(f"[PDF Gen] Logo not found at: {LOGO_PATH}")
        pdf.set_xy(logo_x_mm, logo_y_mm)
        pdf.set_font(title_font_family, "B", 10)
        pdf.cell(20, logo_h_mm, "(Logo Missing)")

    # --- Margins and Content ---
    content_top_margin = header_height + 10
    pdf.set_margins(left=10, top=content_top_margin, right=10)
    page_width = pdf.w - pdf.l_margin - pdf.r_margin
    pdf.set_text_color(*COLOR_BODY_TEXT)
    pdf.ln(10)

    # --- Room Title ---
    title_start_y_mm = 34.7
    pdf.set_y(title_start_y_mm)
    pdf.set_font(title_font_family, "B", 35)
    pdf.set_text_color(*COLOR_BODY_TEXT)
    pdf.multi_cell(0, 12, room.name, 0, 1, "L")
    pdf.ln(8)

    # --- Room Description ---
    pdf.set_font(text_font_family, "", 16)
    pdf.set_text_color(*COLOR_BODY_TEXT)
    pdf.multi_cell(160, 6, room.description, 0, 1, "L")
    pdf.ln(10)

    if room.image_filename:
        image_path = os.path.join(UPLOAD_DIR, room.image_filename)
        print(f"[PDF Gen] Checking for uploaded image at: {image_path}")
        if os.path.exists(image_path):
            try:
                image_start_y_mm = 83.4
                image_x_mm = pdf.l_margin
                image_w_mm = 190

                with PILImage.open(image_path) as pil_img:
                    img_width_px, img_height_px = pil_img.size
                if img_width_px > 0:
                    image_h_mm = (img_height_px / img_width_px) * image_w_mm
                else:
                    image_h_mm = 0

                pdf.set_y(image_start_y_mm)

                pdf.image(
                    image_path, x=image_x_mm, y=image_start_y_mm, w=image_w_mm, h=0
                )
                image_bottom_y = image_start_y_mm + image_h_mm

            except Exception as img_err:
                print(f"[PDF Gen] Error adding image {room.image_filename}: {img_err}")
                pdf.set_y(image_start_y_mm)
                pdf.set_font(text_font_family, "", 10)
                pdf.cell(
                    0, 8, f"[Could not load image: {room.image_filename}]", 0, 1, "C"
                )
                image_bottom_y = pdf.get_y()
        else:
            print(f"[PDF Gen] Image file not found at: {image_path}")
            image_start_y_mm = 83.4
            pdf.set_y(image_start_y_mm)
            pdf.set_font(text_font_family, "", 10)
            pdf.cell(0, 8, f"[Image not found: {room.image_filename}]", 0, 1, "C")
            image_bottom_y = pdf.get_y()
    else:
        image_start_y_mm = 83.4
        pdf.set_y(image_start_y_mm)
        pdf.set_font(text_font_family, "", 10)
        pdf.cell(0, 8, "[No image uploaded]", 0, 1, "C")
        image_bottom_y = pdf.get_y()

    pdf.set_y(image_bottom_y + 15)

    # --- Facilities Title ---
    pdf.set_font(title_font_family, "B", 18)
    pdf.set_text_color(*COLOR_BODY_TEXT)
    pdf.cell(0, 9, "Facilities", 0, 1)
    pdf.ln(3)

    # --- Facilities List ---
    pdf.set_font(text_font_family, "", 14)
    pdf.set_text_color(*COLOR_BODY_TEXT)
    line_height = 8

    facilities = room.facilities
    num_facilities = len(facilities)
    if num_facilities > 0:
        mid_point = (num_facilities + 1) // 2
        col1_items = facilities[:mid_point]
        col2_items = facilities[mid_point:]
        col_padding = 8
        col_width = (page_width - col_padding) / 2
        col1_x = pdf.l_margin
        col2_x = pdf.l_margin + col_width + col_padding

        start_y = pdf.get_y()
        current_y_col1 = start_y
        current_y_col2 = start_y

        # Column 1
        for facility in col1_items:
            pdf.set_xy(col1_x, current_y_col1)
            pdf.multi_cell(col_width, line_height, f"  \u2022 {facility}", 0, "L")
            current_y_col1 = pdf.get_y()

        # Column 2
        for facility in col2_items:
            pdf.set_xy(col2_x, current_y_col2)
            pdf.multi_cell(col_width, line_height, f"  \u2022 {facility}", 0, "L")
            current_y_col2 = pdf.get_y()
        final_y = max(current_y_col1, current_y_col2)
        pdf.set_y(final_y + 5)

    else:
        pdf.set_font(text_font_family, "", 18)
        pdf.cell(0, line_height, "  (No facilities listed)", 0, 1)
        pdf.ln(10)

    file_path = os.path.join(PDF_OUTPUT_DIR, f"room_{room.id}.pdf")

    try:
        pdf.output(file_path)
        print(f"[PDF Gen] Successfully generated styled PDF: {file_path}")
    except Exception as e:
        print(f"[PDF Gen] Error saving styled PDF for Room ID {room.id}: {e}")
