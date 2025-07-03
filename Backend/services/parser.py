import ifcopenshell  # IFC parser library
from collections import defaultdict

print(ifcopenshell.version)

# Parses and opens an IFC model from file
def parse_ifc_file(file_path):
    try:
        model = ifcopenshell.open(file_path)
        return model
    except Exception as e:
        print(f"Error parsing IFC file: {e}")
        return None

# Determines the level (IfcBuildingStorey) an element belongs to
def get_element_level(element):
    try:
        if hasattr(element, "ContainedInStructure"):
            for rel in element.ContainedInStructure:
                if hasattr(rel, "RelatingStructure"):
                    level = rel.RelatingStructure
                    if level.is_a("IfcBuildingStorey") and hasattr(level, "Name"):
                        return level.Name
    except:
        pass
    return "Unknown"

# Extracts metadata from an IFC element
def extract_element_metadata(element):
    name = element.Name if hasattr(element, "Name") else "Unnamed"
    global_id = element.GlobalId if hasattr(element, "GlobalId") else "Unknown"
    type_name = element.is_a()
    level = get_element_level(element)

    # Extract size from the name
    size = "Unknown"
    if name and ":" in name:
        parts = name.split(":")
        # Assuming the size is part of the name after a colon
        for part in parts:
            if "x" in part: # Assuming size is denoted by 'x' in the name
                size = part.strip()
                break

    # Combine type + size as one identifier for the table
    type_size = f"{type_name} | {size}"

    return {
        "id": global_id,
        "type": type_name,
        "name": name,
        "size": size,
        "level": level,
        "type_size": type_size
    }

# Loads and parses all elements in the IFC file
def load_ifc_elements(file_path):
    model = parse_ifc_file(file_path)
    if not model:
        return []

    elements = []
    for element in model.by_type("IfcProduct"):
        if hasattr(element, "Name") and hasattr(element, "GlobalId"):
            metadata = extract_element_metadata(element)
            elements.append(metadata)
    return elements

# Infers the default unit of measure based on element type
def infer_unit(type_name):
    type_name = type_name.lower()
    if "wall" in type_name or "slab" in type_name or "window" in type_name or "roof" in type_name:
        return "square meters"
    elif "beam" in type_name or "column" in type_name or "footing" in type_name:
        return "cubic meters"
    elif "pipe" in type_name or "duct" in type_name or "cable" in type_name:
        return "meters"
    elif "door" in type_name or "opening" in type_name:
        return "units"
    else:
        return "units"


# Builds the summary table data for frontend display
def generate_element_summary(elements):
    # connecting elements to their levels and types
    summary = {}
    levels_set = set()

    for element in elements:
        key = element["type_size"]
        level = element["level"]
        levels_set.add(level)

        if key not in summary:
            summary[key] = {
                "type_size": key,
                "unit": infer_unit(element["type"]),
                "total_quantity": 0,
                "levels": defaultdict(int)
            }

        summary[key]["total_quantity"] += 1
        summary[key]["levels"][level] += 1

    # Final output for API
    result = []
    for key, data in summary.items():
        row = {
            "type_size": data["type_size"],
            "unit": data["unit"],
            "total_quantity": data["total_quantity"],
        }
        for level in sorted(levels_set):
            row[level] = data["levels"].get(level, 0)
        result.append(row)

    return result
