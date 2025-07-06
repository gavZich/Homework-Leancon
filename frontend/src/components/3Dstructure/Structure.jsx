import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { IFCLoader } from 'web-ifc-three/IFCLoader';

export default function SimpleIFCViewer() {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Basic scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf5f5f5);

        const camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        camera.position.set(10, 10, 10);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // Simple orbit controls (mouse interaction)
        let mouseDown = false;
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;

        const handleMouseDown = (event) => {
            mouseDown = true;
            mouseX = event.clientX;
            mouseY = event.clientY;
        };

        const handleMouseMove = (event) => {
            if (!mouseDown) return;
            
            const deltaX = event.clientX - mouseX;
            const deltaY = event.clientY - mouseY;
            
            targetX += deltaX * 0.01;
            targetY += deltaY * 0.01;
            
            mouseX = event.clientX;
            mouseY = event.clientY;
        };

        const handleMouseUp = () => {
            mouseDown = false;
        };

        const handleWheel = (event) => {
            const delta = event.deltaY * 0.01;
            camera.position.multiplyScalar(1 + delta * 0.1);
        };

        container.addEventListener('mousedown', handleMouseDown);
        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseup', handleMouseUp);
        container.addEventListener('wheel', handleWheel);

        // Fetch and load IFC file
        const loadIFC = async () => {
            try {
                // Fetch the IFC file from the backend
                const response = await fetch('/api/ifc-file/simple_example.ifc');
                if (!response.ok) throw new Error('Failed to fetch IFC file');
                
                const arrayBuffer = await response.arrayBuffer();
                
                // Load IFC using web-ifc-three
                const ifcLoader = new IFCLoader();
                ifcLoader.ifcManager.setWasmPath('https://unpkg.com/web-ifc@0.0.46/wasm/');
                
                const blob = new Blob([arrayBuffer]);
                //const url = URL.createObjectURL(blob);
                
                const url = 'simple_example.ifc';
                ifcLoader.load(
                url,
                (ifcModel) => {
                    scene.add(ifcModel);
                    console.log('IFC model loaded from public folder');
                },
                undefined,
                (error) => {
                    console.error('Failed to parse IFC from public:', error);
                }
                );
                
            } catch (error) {
                console.error('Error loading IFC:', error);
                
                // Fallback: show simple placeholder
                const fallbackGeometry = new THREE.BoxGeometry(2, 2, 2);
                const fallbackMaterial = new THREE.MeshBasicMaterial({ 
                    color: 0xff6b6b,
                    wireframe: true
                });
                const fallback = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
                scene.add(fallback);
            }
        };

        loadIFC();

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            
            // Smooth camera rotation
            currentX += (targetX - currentX) * 0.1;
            currentY += (targetY - currentY) * 0.1;
            
            const radius = camera.position.length();
            camera.position.x = radius * Math.cos(currentX) * Math.cos(currentY);
            camera.position.y = radius * Math.sin(currentY);
            camera.position.z = radius * Math.sin(currentX) * Math.cos(currentY);
            
            camera.lookAt(0, 0, 0);
            
            renderer.render(scene, camera);
        };
        animate();

        // Handle window resize
        const handleResize = () => {
            if (!container) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            container.removeEventListener('mousedown', handleMouseDown);
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseup', handleMouseUp);
            container.removeEventListener('wheel', handleWheel);
            window.removeEventListener('resize', handleResize);
            
            if (container && container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            
            renderer.dispose();
        };
    }, []);

    return (
        <div 
            ref={containerRef} 
            style={{
                width: '100%',
                height: '500px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'grab',
                background: '#f9f9f9'
            }}
        />
    );
}