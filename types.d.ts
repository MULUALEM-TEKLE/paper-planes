import { ThreeElements } from "@react-three/fiber"
import * as THREE from "three"

declare global {
	namespace React {
		namespace JSX {
			interface IntrinsicElements extends ThreeElements {
				colorAnimationMaterial: THREE.ShaderMaterial & {
					uniforms: {
						time: { value: number }
						resolution: { value: [number, number] }
						scale: { value: number }
						speed: { value: number }
						isolineIntensity: { value: number }
						cellCenterIntensity: { value: number }
						vibrantColor1: { value: THREE.Color }
						vibrantColor2: { value: THREE.Color }
						vibrantColor3: { value: THREE.Color }
					}
				}
				butterflyWingsMaterial: THREE.ShaderMaterial & {
					uniforms: {
						time: { value: number }
						color1: { value: THREE.Color }
						color2: { value: THREE.Color }
						color3: { value: THREE.Color }
						side: { value: THREE.Side }
					}
				}
			}
		}
	}
}
