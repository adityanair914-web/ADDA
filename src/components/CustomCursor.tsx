import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export default function CustomCursor() {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const [hovered, setHovered] = useState(false);
    const [clicked, setClicked] = useState(false);

    // Spring-follow for the outer ring
    const springX = useSpring(cursorX, { stiffness: 180, damping: 20 });
    const springY = useSpring(cursorY, { stiffness: 180, damping: 20 });

    useEffect(() => {
        const move = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };
        const down = () => setClicked(true);
        const up = () => setClicked(false);

        // Interactive hover detection on links/buttons
        const addHover = () => setHovered(true);
        const removeHover = () => setHovered(false);

        document.addEventListener('mousemove', move);
        document.addEventListener('mousedown', down);
        document.addEventListener('mouseup', up);

        const interactables = document.querySelectorAll('a, button, [role="button"]');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', addHover);
            el.addEventListener('mouseleave', removeHover);
        });

        return () => {
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mousedown', down);
            document.removeEventListener('mouseup', up);
            interactables.forEach(el => {
                el.removeEventListener('mouseenter', addHover);
                el.removeEventListener('mouseleave', removeHover);
            });
        };
    }, [cursorX, cursorY]);

    return (
        <>
            {/* Dot — snaps to cursor instantly */}
            <motion.div
                style={{
                    position: 'fixed',
                    left: cursorX,
                    top: cursorY,
                    x: '-50%',
                    y: '-50%',
                    width: clicked ? 6 : 8,
                    height: clicked ? 6 : 8,
                    background: hovered ? '#C0476D' : '#7B2D8B',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    mixBlendMode: 'multiply',
                }}
                animate={{ scale: clicked ? 0.6 : 1 }}
                transition={{ duration: 0.1 }}
            />
            {/* Ring — springs behind with delay */}
            <motion.div
                style={{
                    position: 'fixed',
                    left: springX,
                    top: springY,
                    x: '-50%',
                    y: '-50%',
                    pointerEvents: 'none',
                    zIndex: 9998,
                    border: `2px solid ${hovered ? '#C0476D' : '#7B2D8B'}`,
                    borderRadius: '50%',
                    mixBlendMode: 'multiply',
                }}
                animate={{
                    width: hovered ? 48 : clicked ? 18 : 28,
                    height: hovered ? 48 : clicked ? 18 : 28,
                    opacity: hovered ? 0.7 : 0.4,
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            />
        </>
    );
}
