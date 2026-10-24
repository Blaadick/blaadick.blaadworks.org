const VERTEX = `#version 300 es
layout(location = 0) in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

export function createFullscreenShader(canvas: HTMLCanvasElement, fragment: string) {
    const gl = canvas.getContext('webgl2', {premultipliedAlpha: true})!;

    function compile(type: number, source: string) {
        const shader = gl.createShader(type)!;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
    }

    const program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    return {gl, program};
}

export function readColor(element: Element, property = 'color') {
    const [r, g, b, a = 1] = getComputedStyle(element).getPropertyValue(property).match(/[\d.]+/g)!.map(Number);
    return [r / 255, g / 255, b / 255, a] as const;
}
