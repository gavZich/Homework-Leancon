// src/components/3Dstructure/Structure.jsx
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import * as OBC from "@thatopen/components";
import "@thatopen/components-front";
import "@thatopen/fragments";
import "@thatopen/ui";
import "./Structure.css";

export default function SimpleIFCViewer({ highlight }) {
  const containerRef = useRef(null);
  const loadedModel  = useRef(null); // Reference to the loaded model

  // Handle Highlighting state
  useEffect(() => {
    if (!containerRef.current) return;

    // 1️⃣ Create ThatOpen world
    const components = new OBC.Components();
    const world      = components
      .get(OBC.Worlds)
      .create(OBC.SimpleScene, OBC.SimpleCamera, OBC.SimpleRenderer);

    world.scene    = new OBC.SimpleScene(components);
    world.renderer = new OBC.SimpleRenderer(components, containerRef.current);
    world.camera   = new OBC.SimpleCamera(components);

    // 2️⃣ Lights & grid
    const threeScene = world.scene.three;
    threeScene.background = new THREE.Color(0xf5f5f5);
    threeScene.add(
      new THREE.AmbientLight(0xffffff, 0.5),
      (() => {
        const dl = new THREE.DirectionalLight(0xffffff, 0.5);
        dl.position.set(5, 10, 7.5);
        return dl;
      })()
    );
    components.get(OBC.Grids).create(world);

    // 3️⃣ Start the render loop
    components.init();

    // 4️⃣ IFC → Fragments conversion wrapped in try/catch
    (async () => {
      const ifcLoader = components.get(OBC.IfcLoader);
      const fragments = components.get(OBC.FragmentsManager);

      try {
        fragments.init(
          "https://thatopen.github.io/engine_fragment/resources/worker.mjs"
        );

        await ifcLoader.setup({
          autoSetWasm: false,
          wasm: {
            path:   "/web-ifc.wasm",
            mtPath: "/web-ifc-mt.wasm",
            absolute: true,
          },
        });

        fragments.list.onItemSet.add(({ value: model }) => {
          loadedModel.current = model;
          // Add model to the scene
          threeScene.add(model.object);
        });

        const resp = await fetch("/api/ifc-file/rstadvancedsampleproject.ifc");
        if (!resp.ok) {
          console.warn("IFC fetch failed:", resp.status);
          return;
        }
        const buffer = await resp.arrayBuffer();
        const bytes  = new Uint8Array(buffer);
        // Load IFC file into fragments
        await ifcLoader.load(bytes, false, "myModel", {
          processData: { progressCallback: (p) => console.log("IFC→Fragments", p) },
        });
      } catch (e) {
        console.warn("IFC→Fragments step skipped due to error:", e);
      }
    })();

    // 5️⃣ Cleanup on unmount (guarded)
    return () => {
      try {
        components.dispose();
      } catch (e) {
        console.warn("components.dispose() threw, ignoring:", e);
      }
    };
  }, []);

  // 6️⃣ React to highlight changes
  useEffect(() => {
    const model = loadedModel.current;
    if (!model || !highlight?.value) return;

    try {
      const { type, value } = highlight;

      if (type === "level") {
        model.object.traverse((mesh) => {
          if (!mesh.isMesh) return;
          mesh.material = mesh.material.clone();
          mesh.material.emissive =
            mesh.userData.storey === value
              ? new THREE.Color(0xffd54f)
              : new THREE.Color(0x000000);
        });
      }

      if (type === "element") {
        model.object.traverse((mesh) => {
          if (!mesh.isMesh) return;
          mesh.material = mesh.material.clone();
          mesh.material.emissive =
            mesh.userData.type_size === value
              ? new THREE.Color(0x4fc3f7)
              : new THREE.Color(0x000000);
        });
      }
    } catch (e) {
      console.warn("Highlight application failed:", e);
    }
  }, [highlight]);

  return (
    <div
      ref={containerRef}
      className="viewer-container"
    />
  );
}
