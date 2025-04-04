import { createRoot } from "react-dom/client"
import Experience from "./Experience"
import { Canvas } from "@react-three/fiber"
import "./index.css"
import { Leva } from "leva"
import { Perf } from "r3f-perf"

createRoot(document.getElementById("root")!).render(
	<>
		<Leva oneLineLabels />
		<Canvas camera={{ fov: 25, position: [0, 0, 25] }}>
			{/* <Perf position="bottom-left" /> */}
			<Experience />
		</Canvas>
	</>
)
