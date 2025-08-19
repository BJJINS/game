import Lights from './Lights.jsx';
import { Level } from './level.jsx';
import Player from './Player.jsx';
import useGame from './stores/useGame.js';

export default function Experience() {
    const blocksCount = useGame((state) => { return state.blocksCount; });
    const blocksSeed = useGame(state => state.blocksSeed);
    return <>
        <color args={['#bdedfc']} attach="background" />
        <Level count={blocksCount} seed={blocksSeed} />
        <Player />
        <Lights />
    </>;
}