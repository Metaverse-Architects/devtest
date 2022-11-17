import { movePlayerTo } from "@decentraland/RestrictedActions"
import { TriggerButton } from "./triggerButton"
import * as utils from '@dcl/ecs-scene-utils'
import { createCoin } from "./coin"

const museum = new Entity()
const museumcolliders = new Entity()
const assets = new Entity()
const rocketboard = new Entity()
const portal = new TriggerButton()
const portal2 = new TriggerButton()
const portal3 = new TriggerButton()
const coinShape = new GLTFShape('models/coin.glb')
const coinPositions = [
  new Vector3(10, 9, 9),
  new Vector3(19, 9, 10),
  new Vector3(8, 9, 8),
  new Vector3(8, 9, 9)
]
const triggerBoxShape = new utils.TriggerBoxShape(
  new Vector3(1.5, 3, 1.5),
  new Vector3(0, 1, 0)
)

let counter = 0

const addCounter = () => {
  counter++
  if (counter > 2) {
    movePlayerTo(new Vector3(12, 24.88, 7.44), new Vector3(15.99, 9.68, 3.13))
  }
}

for (const coinPosition of coinPositions) {
  createCoin(
    coinShape,
    new Transform({ position: coinPosition }),
    triggerBoxShape,
    addCounter
  )
}


museum.addComponent(new GLTFShape('models/YW_MainGeo_1.glb'))
museumcolliders.addComponent(new GLTFShape('models/YW_Colliders_1.glb'))
assets.addComponent(new GLTFShape('models/YW_Assets_1.glb'))
rocketboard.addComponent(new GLTFShape('models/rocketBoard.glb'))
rocketboard.addComponentOrReplace(new Transform({
  position: new Vector3(10.00, 24.88, 7.44),
  scale: new Vector3(1, 1, 1),
  rotation: new Quaternion().setEuler(0.000, 0.000, 0.000),
}))

portal.addComponentOrReplace(new Transform({
  position: new Vector3(16.07, 1.19, 7.39),
  scale: new Vector3(1, 1, 1),
  rotation: new Quaternion().setEuler(0.000, 0.000, 0.000),
}))
portal.onClick = () => {
  movePlayerTo(new Vector3(16.20, 9.68, 10.29), new Vector3(15.99, 9.68, 3.13))
}
//portal.removeComponent(BoxShape)
portal2.addComponentOrReplace(new Transform({
  position: new Vector3(10, 9.68, 10.29),
  scale: new Vector3(1, 1, 1),
  rotation: new Quaternion().setEuler(0.000, 0.000, 0.000),
}))

portal3.addComponentOrReplace(new Transform({
  position: new Vector3(10, 18, 10.29),
  scale: new Vector3(1, 1, 1),
  rotation: new Quaternion().setEuler(0.000, 0.000, 0.000)
}))



portal2.onClick = () => {
  movePlayerTo(new Vector3(12, 20, 7.39), new Vector3(15.99, 9.68, 3.13))
}

portal3.onClick = () => {
  movePlayerTo(new Vector3(12, 24.88, 7.44), new Vector3(15.99, 9.68, 3.13))
}

engine.addEntity(portal)
engine.addEntity(museum)
engine.addEntity(museumcolliders)
engine.addEntity(assets)
engine.addEntity(rocketboard)
engine.addEntity(portal2)
engine.addEntity(portal3)





