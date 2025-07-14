// // This component is a Debugging tool for viewing IFC file
// //  that extract from the file from 'public/models/simple_example.ifc'.
// import React, { useEffect, useRef } from 'react';
// import * as THREE from 'three';
// import { IFCLoader } from 'three/examples/jsm/loaders/IFCLoader.js';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// const IFCViewer = () => {
//   const containerRef = useRef(null);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     // Scene setup
//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0xf0f0f0);

//     const camera = new THREE.PerspectiveCamera(
//       75,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       1000
//     );
//     camera.position.set(8, 13, 15);

//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     containerRef.current.appendChild(renderer.domElement);

//     // Controls
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;
//     controls.dampingFactor = 0.05;

//     // Lights
//     const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//     directionalLight.position.set(10, 10, 10);
//     scene.add(directionalLight);

//     const ambientLight = new THREE.AmbientLight(0x404040);
//     scene.add(ambientLight);

//     // IFC Loader
//     const loader = new IFCLoader();
//     loader.ifcManager.setWasmPath('/'); 

//     loader.load('/models/simple_example.ifc', (ifcModel) => {
//       scene.add(ifcModel);
//     });

//     // Animate
//     const animate = () => {
//       requestAnimationFrame(animate);
//       controls.update();
//       renderer.render(scene, camera);
//     };
//     animate();

//     // Resize handling
//     const handleResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };
//     window.addEventListener('resize', handleResize);

//     // Cleanup
//     return () => {
//       window.removeEventListener('resize', handleResize);
//       if (containerRef.current?.contains(renderer.domElement)) {
//         containerRef.current.removeChild(renderer.domElement);
//       }
//     };
//   }, []);

//   return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />;
// };

// export default IFCViewer;
