import { movePlayerTo } from "@decentraland/RestrictedActions"
import { TriggerButton } from "./triggerButton"
import * as utils from '@dcl/ecs-scene-utils'
import { createCoin } from "./coin"
import { Sound } from "./sound"
import { Body } from "cannon"

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
const rocketBoardTransform = rocketboard.addComponentOrReplace(new Transform({
  position: new Vector3(10.00, 24.88, 7.44),
  scale: new Vector3(1, 1, 1),
  rotation: new Quaternion().setEuler(0.000, 0.000, 0.000),
}))

const rocketFlames = new Entity()
rocketFlames.addComponent(new Transform({ scale: new Vector3(0, 0, 0) }))
rocketFlames.addComponent(new GLTFShape('models/rocketFlames.glb'))
rocketFlames.setParent(rocketboard)
const rocketBoosterSound = new Sound(
  new AudioClip('sounds/rocketBooster.mp3'),
  true
)

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
// vectors
let forwardVector = Vector3.Forward().rotate(Camera.instance.rotation)
const velocityScale = 250

// // world
const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)
const groundMaterial = new CANNON.Material('groundMaterial')
const groundContactMaterial = new CANNON.ContactMaterial(
  groundMaterial,
  groundMaterial,
  { friction: 0.5, restitution: 0.33 }
)

// //Create ground plane and apply physics material
const groundBody = new CANNON.Body({ mass: 0 })
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2) //Reorient ground plane to be on the y axis

const groundShape: CANNON.Plane = new CANNON.Plane()
groundBody.addShape(groundShape)
groundBody.material = groundMaterial
world.addBody(groundBody)

const boxMaterial = new CANNON.Material('boxMaterial')
const boxContactMaterial = new CANNON.ContactMaterial(
  groundMaterial,
  boxMaterial,
  { friction: 0.4, restitution: 0 }
)

world.addContactMaterial(boxContactMaterial)

const rocketBody: CANNON.Body = new CANNON.Body({
  mass: 0,
  position: new CANNON.Vec3(
    rocketBoardTransform.position.x,
    rocketBoardTransform.position.y,
    rocketBoardTransform.position.z
  ),
  shape: new CANNON.Box(new CANNON.Vec3(2, 0.1, 2)), //Create a spherical body with radius 1
  type: CANNON.Body.DYNAMIC
})
rocketBody.material = boxMaterial
world.addBody(rocketBody)

const fixedTimeStep: number = 1.0 / 60.0
const maxSubSteps: number = 3

class physicsUpdateSystem implements ISystem {
  update(dt: number): void {
    world.step(fixedTimeStep, dt, maxSubSteps)

    if (isFKeyPressed) {
      rocketBody.mass = 5
      rocketBody.updateMassProperties()
      rocketBody.applyForce(
        new CANNON.Vec3(0, 1 * velocityScale, 0),
        new CANNON.Vec3(
          rocketBody.position.x,
          rocketBody.position.y,
          rocketBody.position.z
        )
      )
    }
    if (isEKeyPressed) {
      rocketBody.mass = 5
      rocketBody.updateMassProperties()
      rocketBody.applyForce(
        new CANNON.Vec3(
          0,
          0,
          1 * velocityScale
        ),
        new CANNON.Vec3(
          rocketBody.position.x,
          rocketBody.position.y,
          rocketBody.position.z
        )
      )
    }
    rocketBody.angularVelocity.setZero()
    rocketboard.getComponent(Transform).position.copyFrom(rocketBody.position)
    forwardVector = Vector3.Forward().rotate(Camera.instance.rotation)
  }
}

engine.addSystem(new physicsUpdateSystem())

const input = Input.instance
let isFKeyPressed = false
let isEKeyPressed = false

// E Key
input.subscribe('BUTTON_DOWN', ActionButton.PRIMARY, false, () => {
  activateRocketBooster((isEKeyPressed = true))
})
input.subscribe('BUTTON_UP', ActionButton.PRIMARY, false, () => {
  isEKeyPressed = false
  rocketBody.velocity.set(0, 0, 0)
  if (!isFKeyPressed) {
    activateRocketBooster(false)
  }
})

// F Key
input.subscribe('BUTTON_DOWN', ActionButton.SECONDARY, false, () => {
  activateRocketBooster((isFKeyPressed = true))
})
input.subscribe('BUTTON_UP', ActionButton.SECONDARY, false, () => {
  isFKeyPressed = false
  if (!isEKeyPressed) {
    activateRocketBooster(false)
  }
})

function activateRocketBooster(isOn: boolean) {
  if (isOn) {
    rocketBoosterSound.getComponent(AudioSource).playing = true
    rocketFlames.getComponent(Transform).scale.setAll(1)
  } else {
    rocketBoosterSound.getComponent(AudioSource).playing = false
    rocketFlames.getComponent(Transform).scale.setAll(0)
  }
}

engine.addEntity(portal)
engine.addEntity(museum)
engine.addEntity(museumcolliders)
engine.addEntity(assets)
engine.addEntity(rocketboard)
engine.addEntity(portal2)
engine.addEntity(portal3)





