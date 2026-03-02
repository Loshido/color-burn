import "./style.css"
import setupPhysics from "./physics"
import setupLogic from "./logic/mod"

// const n = Math.floor(5 + Math.random() * 7)
const n = 6
const { onPouring } = setupLogic(n)
setupPhysics({ onPouring })