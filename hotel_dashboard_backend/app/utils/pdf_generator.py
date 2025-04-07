import os
import shutil
import uuid
import json
from fpdf import FPDF
from datetime import datetime
from app.models.room import Room
from app.utils.file_handler import UPLOAD_DIR

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


def add_custom_fonts(pdf: FPDF):
    fonts_loaded = True
    try:
        pdf.add_font("Karla", "M", KARLA_MEDIUM_PATH, uni=True)
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

    pdf = FPDF("P", "mm", "A4")
    pdf.set_auto_page_break(auto=True, margin=15)

    fonts_added = add_custom_fonts(pdf)
    title_font_family = "Karla" if fonts_added else "Helvetica"
    text_font_family = "Merriweather" if fonts_added else "Helvetica"

    pdf.add_page()
    full_page_width = pdf.w

    # --- Header ---
    header_height = 23.5
    pdf.set_fill_color(*COLOR_HEADER_BG)
    pdf.set_text_color(*COLOR_WHITE)
    pdf.rect(0, 0, full_page_width, header_height, "F")

    # --- Logo (Using refined mm values based on pixel proportions) ---
    logo_x_mm = 10
    logo_y_mm = 6
    logo_h_mm = 11.5
    if os.path.exists(LOGO_PATH):
        try:
            pdf.image(LOGO_PATH, x=logo_x_mm, y=logo_y_mm, h=logo_h_mm, w=0)
        except Exception as logo_err:
            print(f"[PDF Gen] Error adding logo: {logo_err}")
            pdf.set_xy(logo_x_mm, logo_y_mm)
            pdf.set_font(title_font_family, "M", 10)
            pdf.cell(20, logo_h_mm, "(Logo Err)")
    elif not os.path.exists(LOGO_PATH):
        print(f"[PDF Gen] Logo not found at: {LOGO_PATH}")
        pdf.set_xy(logo_x_mm, logo_y_mm)
        pdf.set_font(title_font_family, "M", 10)
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
    pdf.set_font(title_font_family, "M", 40)
    pdf.set_text_color(*COLOR_BODY_TEXT)
    pdf.multi_cell(0, 14, room.name, 0, 1, "L")
    pdf.ln(8)

    # --- Room Description ---
    # Description starts after the title block
    pdf.set_font(text_font_family, "", 16)  # Merriweather Regular, ~21pt
    pdf.set_text_color(*COLOR_BODY_TEXT)
    pdf.multi_cell(0, 6, room.description, 0, 1, "L")
    pdf.ln(10)

    if room.image_filename:
        image_path = os.path.join(UPLOAD_DIR, room.image_filename)
        print(f"[PDF Gen] Checking for uploaded image at: {image_path}")
        if os.path.exists(image_path):
            try:
                max_image_width = page_width * 0.8
                pdf.image(
                    image_path, x=pdf.l_margin + (page_width * 0.1), w=max_image_width
                )
                pdf.ln(8)
            except Exception as img_err:
                print(f"[PDF Gen] Error adding image {room.image_filename}: {img_err}")
                pdf.set_font(text_font_family, "I", 10)
                pdf.cell(
                    0, 8, f"[Could not load image: {room.image_filename}]", 0, 1, "C"
                )
                pdf.ln(5)
        else:
            print(f"[PDF Gen] Image file not found at: {image_path}")
            pdf.set_font(text_font_family, "I", 10)
            pdf.cell(0, 8, f"[Image not found: {room.image_filename}]", 0, 1, "C")
            pdf.ln(5)
    else:
        pdf.set_font(text_font_family, "I", 10)
        pdf.cell(0, 8, "[No image uploaded]", 0, 1, "C")
        pdf.ln(5)

    # --- Facilities Title ---
    # Karla, Weight 500 ('M' style), ~24pt
    pdf.set_font(title_font_family, "M", 24)  # Use 'M' for Karla Medium
    pdf.set_text_color(*COLOR_BODY_TEXT)
    pdf.cell(0, 9, "Facilities", 0, 1)
    pdf.ln(3)

    # --- Facilities List (Two Columns) ---
    pdf.set_font(text_font_family, "", 18)  # Merriweather Regular, ~18pt
    pdf.set_text_color(*COLOR_BODY_TEXT)
    line_height = 10  # mm - Adjust for desired spacing (~18pt font size is ~6.4mm)

    facilities = room.facilities
    num_facilities = len(facilities)
    if num_facilities > 0:
        mid_point = (num_facilities + 1) // 2  # Split list, leaning left
        col1_items = facilities[:mid_point]
        col2_items = facilities[mid_point:]

        # Calculate column widths and positions
        col_padding = 5  # mm padding between columns
        col_width = (page_width - col_padding) / 2
        col1_x = pdf.l_margin
        col2_x = pdf.l_margin + col_width + col_padding

        # Store starting Y position
        start_y = pdf.get_y()
        current_y_col1 = start_y
        current_y_col2 = start_y

        # Draw Column 1
        for facility in col1_items:
            pdf.set_xy(col1_x, current_y_col1)
            # Use multi_cell in case a facility name is very long
            pdf.multi_cell(col_width, line_height, f"  \u2022 {facility}", 0, "L")
            current_y_col1 = pdf.get_y()  # Update y based on where multi_cell finished

        # Draw Column 2
        for facility in col2_items:
            pdf.set_xy(col2_x, current_y_col2)
            pdf.multi_cell(col_width, line_height, f"  \u2022 {facility}", 0, "L")
            current_y_col2 = pdf.get_y()

        # Set Y position below the longest column before next section
        final_y = max(current_y_col1, current_y_col2)
        pdf.set_y(final_y + 5)  # Add 5mm gap after facilities

    else:
        # Handle case with no facilities if necessary
        pdf.set_font(text_font_family, "I", 18)  # Italic
        pdf.cell(0, line_height, "  (No facilities listed)", 0, 1)
        pdf.ln(10)

    pdf.set_font(text_font_family, "", 11)
    pdf.set_text_color(*COLOR_BODY_TEXT)
    pdf.set_y(-15)
    pdf.cell(page_width / 2, 5, "© The Hugo 2025", 0, 0, "L")
    gen_date_str = datetime.now().strftime("%d/%m/%y")
    pdf.cell(page_width / 2, 5, gen_date_str, 0, 1, "R")

    file_path = os.path.join(PDF_OUTPUT_DIR, f"room_{room.id}.pdf")
    try:
        pdf.output(file_path)
        print(f"[PDF Gen] Successfully generated styled PDF: {file_path}")
    except Exception as e:
        print(f"[PDF Gen] Error saving styled PDF for Room ID {room.id}: {e}")


if __name__ == "__main__":
    import uuid

    print(f"Attempting direct PDF generation test...")
    print(f"Base directory: {BASE_DIR}")
    print(f"Assets directory: {ASSETS_DIR}")
    print(f"Upload directory: {UPLOAD_DIR}")
    print(f"PDF output directory: {PDF_OUTPUT_DIR}")

    test_image_filename = "test_room_image.png"
    test_image_src_path = os.path.join(IMAGE_ASSETS_DIR, "room_image.png")
    test_image_dest_path = os.path.join(UPLOAD_DIR, test_image_filename)

    if os.path.exists(test_image_src_path):
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        shutil.copyfile(test_image_src_path, test_image_dest_path)
        print(
            f"Copied test image from '{test_image_src_path}' to '{test_image_dest_path}'"
        )

        test_room = Room(
            id=uuid.uuid4(),
            name="No. 4 King Junior Suite",
            description="Modern luxury with kingsized bed, walk-in shower, double sinks, sitting area and air conditioning.",
            facilities=[
                "Testing",
                "Image Embedding",
                "Fonts",
                "Colors",
                "Multi-column Layout",
                "FPDF2",
                "FastAPI",
                "Pytest",
            ],
            image_filename=test_image_filename,
        )

        try:
            generate_room_pdf(test_room)
            print(f"PDF generation test complete for room {test_room.id}.")
            print(f"Please check the file in the '{PDF_OUTPUT_DIR}' directory.")
        except Exception as e:
            print(f"Error during PDF generation test: {e}")
        finally:
            if os.path.exists(test_image_dest_path):
                os.remove(test_image_dest_path)
                print(f"Cleaned up test image: {test_image_dest_path}")
    else:
        print(f"ERROR: Cannot run test. Source image missing: {test_image_src_path}")
