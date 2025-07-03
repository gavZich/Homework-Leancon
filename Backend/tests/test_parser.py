import sys
import os

# Add the parent directory to the system path so we can import from services
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Import necessary functions from the parser module
from services.parser import (
    parse_ifc_file,
    load_ifc_elements,
    get_element_level,
    extract_element_metadata
)

# Define absolute path to IFC file
ifc_relative_path = os.path.join("data", "simple_example.ifc")
file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ifc_relative_path))

print("\n Testing parse_ifc_file:::::")
model = parse_ifc_file(file_path)
if model:
    print("  ✅ IFC file parsed successfully.")
else:
    print("  ❌ Failed to parse IFC file.")

print("\n Testing load_ifc_elements:::::")
elements = load_ifc_elements(file_path)
if elements:
    print(f"  ✅ Loaded {len(elements)} elements.")
else:
    print("  ❌ No elements loaded.")

print("\n Testing get_element_level and extract_element_metadata:::::")
# Test only on IfcProduct elements
for element in model.by_type("IfcProduct"):
    metadata = extract_element_metadata(element)
    print(metadata)