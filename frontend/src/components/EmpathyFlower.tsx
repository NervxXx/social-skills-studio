import React from "react";

interface EmpathyFlowerProps {
    skills: {
        empathy: number;
        clarity: number;
        emotional_control: number;
        assertiveness: number;
    };
    size?: number;
}

const EmpathyFlower: React.FC<EmpathyFlowerProps> = ({ skills, size = 200 }) => {
    const skillsList = [
        { name: "Empathy", score: skills.empathy, color: "hsl(var(--primary))" },
        { name: "Clarity", score: skills.clarity, color: "hsl(var(--secondary))" },
        { name: "Control", score: skills.emotional_control, color: "hsl(var(--accent))" },
        { name: "Assertive", score: skills.assertiveness, color: "hsl(280 80% 60%)" },
    ];

    return (
        <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
            {/* Center of the flower */}
            <div
                className="absolute z-10 rounded-full bg-yellow-400 shadow-glow animate-pulse"
                style={{ width: size * 0.15, height: size * 0.15 }}
            />

            {/* Petals */}
            {skillsList.map((skill, i) => {
                const angle = (i * 360) / skillsList.length;
                const scale = 0.3 + (skill.score / 100) * 0.7;
                const opacity = 0.2 + (skill.score / 100) * 0.8;

                return (
                    <div
                        key={skill.name}
                        className="absolute transition-all duration-1000 ease-out origin-center"
                        style={{
                            transform: `rotate(${angle}deg) translateY(-${size * 0.2}px) scale(${scale})`,
                            opacity,
                        }}
                    >
                        <div
                            className="rounded-full blur-[1px]"
                            style={{
                                width: size * 0.4,
                                height: size * 0.55,
                                background: `radial-gradient(circle at center, ${skill.color}, transparent 80%)`,
                                boxShadow: `0 0 20px ${skill.color}44`,
                            }}
                        />
                        {/* Skill name label - optional, we can leave it for the legend */}
                    </div>
                );
            })}

            {/* Decorative aura */}
            <div className="absolute inset-0 rounded-full border border-primary/10 animate-spin-slow" />
        </div>
    );
};

export default EmpathyFlower;
