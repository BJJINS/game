import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useMemo, useRef } from "react";
import { BoxGeometry, Euler, MeshStandardMaterial, Quaternion } from "three";

const boxGeometry = new BoxGeometry(1, 1, 1);

// 起始和结束方块地板
const floor1Material = new MeshStandardMaterial({ color: "limegreen" });
// 陷阱方块层
const floor2Material = new MeshStandardMaterial({ color: "greenyellow" });
const obstacleMaterial = new MeshStandardMaterial({ color: "orangered" });
const wallMaterial = new MeshStandardMaterial({ color: "slategrey" });

// 起始位置
export const BlockStart = (props) => {
    const { position = [0, 0, 0] } = props;
    return <group position={position}>
        <mesh
            material={floor1Material}
            geometry={boxGeometry}
            receiveShadow
            position={[0, -0.1, 0]}
            scale={[4, 0.2, 4]}
        />
    </group>;
};

export const BlockSpinner = (props) => {
    const { position = [0, 0, 0] } = props;
    const obstacle = useRef(null);
    const random = useRef((Math.random() + 0.2) * (Math.random() < 0.5 ? - 1 : 1));
    useFrame((state) => {
        const elapsed = state.clock.getElapsedTime();
        const rotation = new Quaternion();
        rotation.setFromEuler(new Euler(0, elapsed * random.current, 0));
        obstacle.current.setNextKinematicRotation(rotation);
    });


    return <group position={position}>
        <mesh
            geometry={boxGeometry}
            material={floor2Material}
            position={[0, - 0.1, 0]}
            scale={[4, 0.2, 4]}
            receiveShadow
        />
        <RigidBody ref={obstacle} type="kinematicPosition" position={[0, 0.3, 0]} restitution={0.2} friction={0}>
            <mesh
                geometry={boxGeometry}
                material={obstacleMaterial}
                scale={[3.5, 0.3, 0.3]}
                receiveShadow
                castShadow
            />
        </RigidBody>

    </group>;
};

export const BlockLimbo = (props) => {
    const { position = [0, 0, 0] } = props;
    const obstacle = useRef(null);
    const timeOffset = useRef(Math.random() * Math.PI * 2);
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const y = Math.sin(time + timeOffset.current) + 1.15;
        obstacle.current.setNextKinematicTranslation({ x: position[0], y: position[1] + y, z: position[2] });

    });


    return <group position={position}>
        <mesh
            geometry={boxGeometry}
            material={floor2Material}
            position={[0, - 0.1, 0]}
            scale={[4, 0.2, 4]}
            receiveShadow
        />
        <RigidBody ref={obstacle} type="kinematicPosition" position={[0, 0.3, 0]} restitution={0.2} friction={0}>
            <mesh
                geometry={boxGeometry}
                material={obstacleMaterial}
                scale={[3.5, 0.3, 0.3]}
                receiveShadow
                castShadow
            />
        </RigidBody>

    </group>;
};

export const BlockAxe = (props) => {
    const { position = [0, 0, 0] } = props;
    const obstacle = useRef(null);
    const timeOffset = useRef(Math.random() * Math.PI * 2);
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const x = Math.sin(time + timeOffset.current) * 1.25;
        obstacle.current.setNextKinematicTranslation({ x: position[0] + x, y: position[1] + 0.75, z: position[2] });
    });

    return <group position={position}>
        <mesh
            geometry={boxGeometry}
            material={floor2Material}
            position={[0, - 0.1, 0]}
            scale={[4, 0.2, 4]}
            receiveShadow
        />
        <RigidBody ref={obstacle} type="kinematicPosition" position={[0, 0.3, 0]} restitution={0.2} friction={0}>
            <mesh
                geometry={boxGeometry}
                material={obstacleMaterial}
                scale={[1.5, 1.5, 0.3]}
                receiveShadow
                castShadow
            />
        </RigidBody>

    </group>;
};


export const BlockEnd = (props) => {
    const { position = [0, 0, 0] } = props;
    const hamburger = useGLTF('/hamburger.glb');
    hamburger.scene.children.forEach((mesh) => {
        mesh.castShadow = true;
    });
    return <group position={position}>
        <mesh
            material={floor1Material}
            geometry={boxGeometry}
            receiveShadow
            position={[0, 0, 0]}
            scale={[4, 0.2, 4]}
        />
        <RigidBody type="fixed" colliders="hull" restitution={0.2} friction={0} position={[0, 0.25, 0]}>
            <primitive object={hamburger.scene} scale={0.2} />
        </RigidBody>
    </group>;
};

function Bounds(props) {
    const { length = 1 } = props;
    return <>
        <RigidBody type="fixed" restitution={0.2} friction={0}>
            <mesh
                position={[2.15, 0.75, - (length * 2) + 2]}
                geometry={boxGeometry}
                material={wallMaterial}
                scale={[0.3, 1.5, 4 * length]}
                castShadow
            />
            <mesh
                position={[- 2.15, 0.75, - (length * 2) + 2]}
                geometry={boxGeometry}
                material={wallMaterial}
                scale={[0.3, 1.5, 4 * length]}
                receiveShadow
            />
            <mesh
                position={[0, 0.75, - (length * 4) + 2]}
                geometry={boxGeometry}
                material={wallMaterial}
                scale={[4, 1.5, 0.3]}
                receiveShadow
            />
            <CuboidCollider
                args={[2, 0.1, 2 * length]}
                position={[0, -0.1, - (length * 2) + 2]}
                restitution={0.2}
                friction={1}
            />
        </RigidBody>
    </>;
}

export const Level = (props) => {
    const {
        count = 5,
        types = [BlockSpinner, BlockAxe, BlockLimbo]
    } = props;

    const blocks = useMemo(() => {
        const blocks = [];

        for (let i = 0; i < count; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            blocks.push(type);
        }
        return blocks;
    }, [count, types]);

    return <>
        <BlockStart position={[0, 0, 0]} />
        {blocks.map((Block, index) => <Block key={index} position={[0, 0, -(index + 1) * 4]} />)}
        <BlockEnd position={[0, 0, -(count + 1) * 4]} />
        <Bounds length={count + 2} />
    </>;
};
