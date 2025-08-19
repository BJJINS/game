import Lights from './Lights.jsx';
import { Level } from './level.jsx';
import Player from './Player.jsx';
import { AxesHelper } from 'three';

export default function Experience() {
    return <>

        <axesHelper args={[4]} />
        <Lights />

        <Level />
        <Player />
    </>;
}