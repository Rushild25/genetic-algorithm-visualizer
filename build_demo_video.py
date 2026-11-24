import os
import subprocess

SECTIONS = [
    {
        "id": "01_intro",
        "image": "video_assets/01_overview.png",
        "text": (
            "Welcome to EvoAlgo, an interactive browser-based educational studio designed to teach "
            "Genetic Algorithms from first principles. Inspired by VisuAlgo, EvoAlgo brings evolutionary "
            "computing to life with synchronized step-by-step execution, dynamic pseudocode tracking, "
            "plain-language mathematical explanations, and airtight verification against classic textbook benchmarks."
        ),
        "title": "EvoAlgo: Interactive Genetic Algorithm Studio"
    },
    {
        "id": "02_textbook",
        "image": "video_assets/02_textbook_audit.png",
        "text": (
            "A core requirement of any rigorous educational tool is empirical verification against established literature. "
            "EvoAlgo includes a dedicated Textbook Audit module replicating David E. Goldberg's landmark 1989 benchmark, "
            "maximizing f of x equals x squared on integers from 0 to 31. Every number in Table 1.1, including selection "
            "probabilities, expected counts, and roulette wheel sampling, is verified. In Table 1.2, parent mating pairs, "
            "crossover points at locus 4 and 2, and gene mutation are mathematically demonstrated, producing an identical "
            "49.9 percent average fitness leap in a single generation from 292.5 to 438.5. Students can also test their own "
            "custom binary strings using the built-in interactive hand calculation workbench."
        ),
        "title": "Textbook Verification: David E. Goldberg (1989)"
    },
    {
        "id": "03_stepping",
        "image": "video_assets/01_overview.png",
        "text": (
            "EvoAlgo supports dual-granularity execution. In Micro-Step mode, students advance through each of the five core "
            "biological phases: fitness evaluation, roulette wheel selection, recombination, bit-flip mutation, and elitist survivor "
            "replacement. The dynamic pseudocode panel highlights the exact active algorithm line, accompanied by real-time "
            "mathematical derivations and conceptual guidance explaining why selection pressure multiplies fit building blocks."
        ),
        "title": "5-Phase Stepping Engine & VisuAlgo Pseudocode"
    },
    {
        "id": "04_microscope",
        "image": "video_assets/03_microscope.png",
        "text": (
            "As a unique pedagogical feature beyond standard visualizers, clicking any individual opens the DNA Microscope. "
            "Here, students can inspect individual loci and manually toggle bits in real-time What-If mode. This hands-on "
            "laboratory vividly demonstrates Hamming cliffs and epistasis, showing how flipping a single most-significant bit "
            "radically alters phenotypic fitness, while least-significant bits provide fine-grained optimization."
        ),
        "title": "Interactive DNA Microscope & Mutation Sandbox"
    },
    {
        "id": "05_tsp",
        "image": "video_assets/04_tsp.png",
        "text": (
            "To illustrate permutation chromosomes and physical pathfinding, EvoAlgo features an interactive Travelling Salesperson "
            "Problem canvas. Users can choose from preset city clusters or click directly on the canvas to add custom cities dynamically. "
            "The algorithm applies Order Crossover 1 to preserve visit sequences without creating duplicate cities, allowing learners to "
            "watch tangled Euclidean tours unravel into optimized closed loops in real time."
        ),
        "title": "Travelling Salesperson Problem & Order Crossover (OX1)"
    },
    {
        "id": "06_knapsack",
        "image": "video_assets/05_knapsack.png",
        "text": (
            "In real-world engineering, optimization problems have hard constraints. EvoAlgo demonstrates this via the 0/1 Knapsack Problem, "
            "where a backpack must maximize item value while adhering to a strict weight capacity. Chromosome bits dictate packed items, "
            "with a dynamic progress bar and penalty functions illustrating how evolutionary pressure steers populations toward feasible high-value solutions."
        ),
        "title": "Constrained Optimization: 0/1 Knapsack Problem"
    },
    {
        "id": "07_multimodal",
        "image": "video_assets/06_landscape.png",
        "text": (
            "For continuous optimization, the Rastrigin 2D landscape visualizes swarm convergence on a complex surface with multiple "
            "deceptive local minima, showing how genetic variation prevents premature entrapment. Meanwhile, the Dawkins' Weasel module "
            "demonstrates cumulative character selection, rapidly assembling Shakespearean phrases where random chance would take billions of years."
        ),
        "title": "Continuous Multimodal Surface & Dawkins' Weasel"
    },
    {
        "id": "08_quiz",
        "image": "video_assets/08_quiz.png",
        "text": (
            "To reinforce learning, students can challenge themselves with the built-in Genetic Algorithm Mastery Quiz, featuring instant "
            "feedback on selection pressure, schema theory, and crossover mechanics. EvoAlgo is fully open source, built with React and "
            "TypeScript, and deployed publicly for educators and students worldwide. Explore the live link and GitHub repository below. "
            "Thank you for watching!"
        ),
        "title": "Interactive Knowledge Quiz & Summary"
    }
]

def generate_audio():
    os.makedirs("video_temp", exist_ok=True)
    voice = "en-US-GuyNeural"
    
    print("Generating audio narrations with edge-tts CLI...")
    for idx, sec in enumerate(SECTIONS):
        audio_path = f"video_temp/audio_{idx:02d}.mp3"
        txt_path = f"video_temp/text_{idx:02d}.txt"
        with open(txt_path, "w", encoding="utf-8") as f:
            f.write(sec["text"])
            
        print(f"Generating section {idx + 1}/{len(SECTIONS)}: {sec['id']}...")
        cmd = [
            "edge-tts",
            "--voice", voice,
            "-f", txt_path,
            "--write-media", audio_path
        ]
        subprocess.run(cmd, check=True)
    print("All audio files generated successfully.")

def get_audio_duration(audio_path):
    cmd = [
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", audio_path
    ]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
    return float(res.stdout.strip())

def render_video_clips():
    total_duration = 0.0
    clip_files = []
    
    print("Rendering individual 1080p video clips with ffmpeg...")
    for idx, sec in enumerate(SECTIONS):
        audio_path = f"video_temp/audio_{idx:02d}.mp3"
        clip_path = f"video_temp/clip_{idx:02d}.mp4"
        duration = get_audio_duration(audio_path) + 0.5 # 0.5s padding
        total_duration += duration
        
        img_path = sec["image"]
        title_text = sec["title"].replace(":", "\\:").replace("'", "")
        
        # Scale image to 1920x1080 with padding, overlay subtle dark title bar on top
        vf = (
            "scale=1920:1080:force_original_aspect_ratio=decrease,"
            "pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=#090d16,"
            f"drawbox=y=0:w=1920:h=70:color=black@0.75:t=fill,"
            f"drawtext=text='{title_text}':fontcolor=white:fontsize=32:x=40:y=20"
        )
        
        cmd = [
            "ffmpeg", "-y",
            "-loop", "1", "-i", img_path,
            "-i", audio_path,
            "-c:v", "libx264", "-tune", "stillimage",
            "-c:a", "aac", "-b:a", "192k",
            "-vf", vf,
            "-t", str(duration),
            "-pix_fmt", "yuv420p",
            clip_path
        ]
        
        print(f"Rendering clip {idx + 1}/{len(SECTIONS)} ({duration:.1f}s)...")
        subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        clip_files.append(clip_path)

    # Concat list file
    concat_txt = "video_temp/concat_list.txt"
    with open(concat_txt, "w") as f:
        for clip in clip_files:
            f.write(f"file '{os.path.basename(clip)}'\n")
            
    print("Concatenating into final demo_video.mp4...")
    final_output = "demo_video.mp4"
    concat_cmd = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0",
        "-i", concat_txt,
        "-c", "copy",
        final_output
    ]
    subprocess.run(concat_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
    
    minutes = int(total_duration // 60)
    seconds = int(total_duration % 60)
    print(f"\nSUCCESS! Demo video created: {final_output}")
    print(f"Total Duration: {minutes} minutes {seconds} seconds ({total_duration:.1f} seconds)")

if __name__ == "__main__":
    generate_audio()
    render_video_clips()
