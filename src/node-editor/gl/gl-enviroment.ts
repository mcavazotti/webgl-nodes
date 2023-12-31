
/**
 * Class that handles the WebGL canvas context and the shader compilation and usage
 */
export class GlEnviroment {
    /** Canvas HTML element */
    canvas: HTMLCanvasElement;
    /** WebGL context */
    gl: WebGL2RenderingContext;

    /** Vertices position buffer */
    private positionBuffer: WebGLBuffer;

    private vertexShaderSrc = `#version 300 es
    in vec2 aVertexPos;
    
    void main() {
        gl_Position = vec4(aVertexPos,0,1);
    }
    `;

    /** Uniforms available for fragment shader use */
    readonly uniforms: string[] = [
        "uniform vec2 uResolution;",
        "uniform float uTime;",
        "uniform float uFrame;",
    ];

    /** Compiled vertex shader */
    private vertexShader: WebGLShader;
    /** Compiled fragment shader */
    private fragmentShader?: WebGLShader;
    /** Linked WebGL program */
    private program?: WebGLProgram;

    private startTime: number;
    private frame: number;
    private play = true;

    /**
     * Initialize WebGL context and buffers
     * @param canvasId Id of HTML canvas
     */
    constructor(canvasId: string, private errorCallback: (error: string) => void) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        let gl = this.canvas.getContext("webgl2");
        if (!gl)
            throw Error("WebGL 2 not supported in this browser");

        this.gl = gl;

        this.positionBuffer = gl.createBuffer()!;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

        const positions = [
            1, 1,
            -1, 1,
            1, -1,
            -1, -1,
        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        this.vertexShader = this.loadShader(this.gl.VERTEX_SHADER, this.vertexShaderSrc);
        this.startTime = new Date().getTime();
        this.frame = 0;
    }

    /**
     *  Compile a shader
     * 
     * @param type Shader type. It accepts `WebGLRenderingContextBase.VERTEX_SHADER` or `WebGLRenderingContextBase.FRAGMENT_SHADER`
     * @param source Source code
     * @returns Compiled WebGL shader
     */
    private loadShader(type: number, source: string): WebGLShader {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        const shader = this.gl.createShader(type)!;
        this.gl.shaderSource(shader, source);

        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            let error = Error(`An error occurred compiling the shader: ${this.gl.getShaderInfoLog(shader)}`);
            this.errorCallback(error.message);
            this.gl.deleteShader(shader);
            throw error;
        }

        return shader;
    }

    /**
     * Link the compile shaders into a program. This program is stored on `this.program`.
     * 
     * The previous program, if exists, is disposed.
     */
    private createProgram() {
        if (this.program)
            this.gl.deleteProgram(this.program);

        if (this.fragmentShader) {
            this.program = this.gl.createProgram()!;
            this.gl.attachShader(this.program, this.vertexShader);
            this.gl.attachShader(this.program, this.fragmentShader);
            this.gl.linkProgram(this.program);
            if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
                let error = Error(`Unable to initialize the shader program: ${this.gl.getProgramInfoLog(this.program)}`);
                this.errorCallback(error.message);
                delete this.program;
                throw error;
            }
        }
    }

    /**
     * Draws on canvas using linked program
     */
    render() {
        if (!this.program) {
            const error = Error("Program not loaded");
            this.errorCallback(error.message);
            throw error;
        }

        this.gl.useProgram(this.program);

        const vertexPosition = this.gl.getAttribLocation(this.program, 'aVertexPos');
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;

        const uResPosition = this.gl.getUniformLocation(this.program, "uResolution");
        this.gl.uniform2f(uResPosition, this.canvas.width, this.canvas.height);

        const uTime = this.gl.getUniformLocation(this.program, "uTime");
        this.gl.uniform1f(uTime, (new Date().getTime() - this.startTime) / 1000);

        const uFrame = this.gl.getUniformLocation(this.program, "uFrame");
        this.gl.uniform1f(uFrame, this.frame);

        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.vertexAttribPointer(vertexPosition, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(vertexPosition);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }

    /**
     * Updates fragment shader and recompile the shader/program
     * 
     * @param fragShaderSrc New fragment shader source code
     */
    refreshProgram(fragShaderSrc: string) {
        // console.log(fragShaderSrc)
        this.fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fragShaderSrc);
        this.createProgram();
        this.renderLoop();
    }

    renderLoop() {
        const timeSpan = document.getElementById('time');
        const frameSpan = document.getElementById('frame');
        if (timeSpan)
            timeSpan!.innerText = ((new Date().getTime() - this.startTime) / 1000).toFixed(2) + 's';
        if (frameSpan)
            frameSpan!.innerText = this.frame.toString();
        this.render();
        if (this.play) {
            window.requestAnimationFrame(this.renderLoop.bind(this));
        }
        this.frame++;
    }

    setPlay(state: boolean) {
        this.play = state;
    }

    reset() {
        this.frame = 0;
        this.startTime = new Date().getTime();
        if(!this.play) this.renderLoop();
    }
}