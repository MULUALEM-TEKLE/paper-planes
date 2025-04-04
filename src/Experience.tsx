import { OrbitControls, Environment } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef, useMemo } from "react"
import * as THREE from "three"
import { Model as PaperPlaneModel } from "./PaperPlane" // Renamed import

// Reusable Plane Component
interface PlaneProps {
	curve: THREE.CatmullRomCurve3
	speed: number
	scale: number // Add scale prop
}

function Plane({ curve, speed, scale }: PlaneProps) {
	// Destructure scale
	const planeRef = useRef<THREE.Group>(null!)
	const curvePoints = curve.points // Get points for loop time calculation

	useFrame((state, delta) => {
		if (planeRef.current) {
			const elapsedTime = state.clock.getElapsedTime()
			const loopTime = curvePoints.length / speed // Adjust time based on points and speed
			const t = (elapsedTime * speed) % 1 // Normalize time to 0-1 range for the curve
			const currentT = t < 0 ? 1 + (t % 1) : t % 1

			const position = curve.getPointAt(currentT)
			planeRef.current.position.copy(position)

			const tangent = curve.getTangentAt(currentT).normalize()
			const lookAtPosition = new THREE.Vector3().copy(position).add(tangent)
			const currentUp = planeRef.current.up.clone()
			planeRef.current.lookAt(lookAtPosition)
			planeRef.current.up.copy(currentUp)
		}
	})

	return <PaperPlaneModel ref={planeRef} scale={scale} /> // Use the scale prop
}

// Function to generate random points for a curve
const generateCurvePoints = (
	numPoints: number,
	radius: number,
	yVariation: number
): THREE.Vector3[] => {
	const points: THREE.Vector3[] = []
	const angleStep = (Math.PI * 2) / numPoints
	for (let i = 0; i < numPoints; i++) {
		const angle = i * angleStep
		const x = Math.cos(angle) * radius + (Math.random() - 0.5) * radius * 0.5 // Add some randomness
		const z = Math.sin(angle) * radius + (Math.random() - 0.5) * radius * 0.5 // Add some randomness
		const y = (Math.random() - 0.5) * yVariation
		points.push(new THREE.Vector3(x, y, z))
	}
	return points
}

export default function Experience() {
	// Define multiple curves
	const curves = useMemo(() => {
		const curveData = [
			{
				points: [
					// Original Path (slightly adjusted for variety)
					new THREE.Vector3(10, -0.5, 0),
					new THREE.Vector3(5, 0.5, 5),
					new THREE.Vector3(0, -1.0, 10),
					new THREE.Vector3(-5, 1.5, 5),
					new THREE.Vector3(-10, 0, 0),
					new THREE.Vector3(-5, -1.5, -5),
					new THREE.Vector3(0, 1.0, -10),
					new THREE.Vector3(5, -0.5, -5),
				],
				speed: 0.06 + Math.random() * 0.03, // Reduced speed
			},
			{
				points: generateCurvePoints(8, 12, 3), // Path 2: Wider radius, more Y variation
				speed: 0.05 + Math.random() * 0.02, // Reduced speed
			},
			{
				points: generateCurvePoints(10, 8, 2), // Path 3: Tighter radius, less Y variation
				speed: 0.07 + Math.random() * 0.03, // Reduced speed
			},
			{
				points: generateCurvePoints(6, 15, 4), // Path 4: Fewer points, largest radius, most Y variation
				speed: 0.04 + Math.random() * 0.02, // Reduced speed
			},
			{
				// Path 5
				points: generateCurvePoints(9, 10, 2.5),
				speed: 0.05 + Math.random() * 0.03, // Reduced speed
			},
			{
				// Path 6
				points: generateCurvePoints(7, 14, 3.5),
				speed: 0.06 + Math.random() * 0.02, // Reduced speed
			},
		]

		// Add random scale to each plane's data
		return curveData.map((data) => {
			const baseScale = 5
			const scaleVariation = 1.5 // Max deviation from base scale
			const randomScale = baseScale + (Math.random() - 0.5) * 2 * scaleVariation // Random scale between baseScale +/- scaleVariation
			return {
				curve: new THREE.CatmullRomCurve3(
					data.points,
					true,
					"centripetal",
					0.5
				),
				speed: data.speed,
				scale: Math.max(1, randomScale), // Ensure scale is at least 1
			}
		})
	}, [])

	return (
		<>
			<OrbitControls makeDefault />
			<Environment preset="city" />
			<ambientLight intensity={0.5} />
			<directionalLight position={[10, 10, 5]} intensity={2} />

			{/* Render multiple planes */}
			{curves.map((data, index) => (
				<Plane
					key={index}
					curve={data.curve}
					speed={data.speed}
					scale={data.scale}
				/> // Pass scale prop
			))}
		</>
	)
}
