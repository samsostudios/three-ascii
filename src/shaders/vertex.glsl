uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
uniform vec3 pixels;
float PI = 3.1415926535897932;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
}