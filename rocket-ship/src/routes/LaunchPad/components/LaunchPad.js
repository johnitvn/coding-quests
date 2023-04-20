import { ClassRocket, FunctionalRocket } from './Rocket';
import '../styles/_launchpad.scss';

export default function LaunchPad() {
 
  return (
    <div className="launchpad">
      <FunctionalRocket />
      <ClassRocket />
    </div>
  );
}
