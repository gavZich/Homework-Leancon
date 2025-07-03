import ifcopenshell # importing the ifcopenshell library to handle IFC files
print(ifcopenshell.version)

# This function attempts to open and parse an IFC file.
def parse_ifc_file(file_path):
    try:
        model = ifcopenshell.open(file_path)
        return model
    except Exception as e:
        print(f"Error parsing IFC file: {e}")
        return None
    

# This function attempts to find the level (IfcBuildingStorey) that an element is contained in.
def get_element_level(element):
    try:
        # Check if the element has a ContainedInStructure relationship between it and an IfcBuildingStorey
        if hasattr(element, "ContainedInStructure"):
            # Iterate through the relationships to find the level
            for rel in element.ContainedInStructure:
                if hasattr(rel, "RelatingStructure"): # Check if the relationship has a relating structure
                    level = rel.RelatingStructure
                    # Check if the level is an instance of IfcBuildingStorey
                    if level.is_a("IfcBuildingStorey") and hasattr(level, "Name"): 
                        return level.Name
    except:
        pass
    return "Unknown"


# This function extracts relevant metadata from an IFC element,
# and returns it as a dictionary.
def extract_element_metadata(element):
    # Extracting basic properties from the element
    name = element.Name if hasattr(element, "Name") else "Unnamed"
    global_id = element.GlobalId if hasattr(element, "GlobalId") else "Unknown"
    type_name = element.is_a()
    level = get_element_level(element)

    # Try to extract size from name
    size = "Unknown"
    if name and ":" in name:
        # Assuming that the size is part of the name
        parts = name.split(":")
        for part in parts:
            if "x" in part: # Assuming size is indicated by 'x' in the name
                size = part.strip()
                break
    # build a dictionary with the extracted metadata
    return {
        "id": global_id,
        "type": type_name, # for example - IfcWall, IfcBeam
        "name": name,
        "size": size,
        "level": level
    }

# This function loads IFC elements from a given file path,
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