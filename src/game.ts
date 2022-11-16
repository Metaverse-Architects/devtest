import { movePlayerTo } from "@decentraland/RestrictedActions"
import { TriggerButton } from "./triggerButton"

const museum = new Entity()
const museumcolliders = new Entity()
const assets = new Entity()
const rocketboard = new Entity()
const portal = new TriggerButton()


museum.addComponent(new GLTFShape('models/YW_MainGeo_1.glb'))
museumcolliders.addComponent(new GLTFShape('models/YW_Colliders_1.glb'))
assets.addComponent(new GLTFShape('models/YW_Assets_1.glb'))
rocketboard.addComponent(new GLTFShape('models/rocketBoard.glb'))
rocketboard.addComponentOrReplace(new Transform({
  position: new Vector3(10.00,24.88,7.44),
  scale: new Vector3(1, 1, 1),
  rotation: new Quaternion().setEuler(0.000, 0.000, 0.000),
}))

portal.addComponentOrReplace(new Transform({
  position: new Vector3(16.07,1.19,7.39),
  scale: new Vector3(1, 1, 1),
  rotation: new Quaternion().setEuler(0.000, 0.000, 0.000),
}))
portal.onClick = () =>{
  movePlayerTo(new Vector3(16.20, 9.68, 10.29), new Vector3(15.99, 9.68, 3.13))
}
//portal.removeComponent(BoxShape)

engine.addEntity(portal)
engine.addEntity(museum)
engine.addEntity(museumcolliders)
engine.addEntity(assets)
engine.addEntity(rocketboard)





