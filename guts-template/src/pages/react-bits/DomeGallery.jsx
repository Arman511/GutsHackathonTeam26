import { useEffect, useMemo, useRef } from 'react';
import './DomeGallery.css';

const DEFAULT_IMAGES = [
    'https://www.sas.com/en_gb/careers/sas-scotland-r-and-d/location/_jcr_content/par/styledcontainer_42de/image.img.jpg/1509619621665.jpg',
    'https://www.sas.com/en_gb/careers/sas-scotland-r-and-d/awards/_jcr_content/par/styledcontainer/par/image.img.png/1559058869940.png',
    'https://www.sas.com/en_gb/careers/sas-scotland-r-and-d/our-culture-same-height/_jcr_content/par/styledcontainer/par/styledcontainer_1464303088/par/image_be1d_copy.img.jpg/1584618197920.jpg',
    'https://www.sas.com/en_gb/careers/sas-scotland-r-and-d/our-culture-same-height/_jcr_content/par/styledcontainer/par/styledcontainer/par/image_be1d_copy.img.jpg/1584618017478.jpg',
    'https://www.sas.com/en_gb/careers/sas-scotland-r-and-d/what-we-do/_jcr_content/par/styledcontainer_5339/par/styledcontainer_copy_1105778661/par/image_copy_copy.img.jpg/1583510744230.jpg',
    'https://www.sas.com/en_gb/careers/sas-scotland-r-and-d/what-we-do/_jcr_content/par/styledcontainer_5339/par/styledcontainer_copy_805865340/par/image_copy_copy.img.jpg/1552073198235.jpg',
    'https://www.sas.com/en_gb/careers/sas-scotland-r-and-d/what-we-do/_jcr_content/par/styledcontainer_5339/par/styledcontainer_copy_1734027132/par/image_copy_copy.img.jpg/1552666444947.jpg',
    'https://preview.redd.it/does-anyone-know-about-sas-analytics-its-in-my-course-with-v0-c0br8godrnfe1.png?width=640&crop=smart&auto=webp&s=6e19230e0a37a3de1b23f9beed4e2acc566235cf',
    'https://images.g2crowd.com/uploads/vendor/image/408/95096087b972c24c6e73c5f70f6da5f8.jpeg'
];

const SEGMENTS = 20;
const RADIUS = 800;

function buildItems(pool, seg) {
    const xCols = Array.from({ length: seg }, (_, i) => -50 + i * 5); // a few extra longitude lines
    const evenYs = [-5, -3, -1, 1, 3, 5];
    const oddYs = [-4, -2, 0, 2, 4, 6];

    const coords = xCols.flatMap((x, c) => {
        const ys = c % 2 === 0 ? evenYs : oddYs;
        return ys.map((y) => ({ x, y, sizeX: 2, sizeY: 2 }));
    });

    const normalizedImages = pool.map((i) => ({ src: i, alt: "" }));
    const usedImages = Array.from(
        { length: coords.length },
        (_, i) => normalizedImages[i % normalizedImages.length]
    );

    return coords.map((c, i) => ({ ...c, src: usedImages[i].src, alt: usedImages[i].alt }));
}

function computeItemRotation(offsetX, offsetY, sizeX, sizeY, segments) {
    const unit = 360 / segments / 2;
    const rotateY = unit * (offsetX + (sizeX - 1) / 2);
    const rotateX = unit * (offsetY - (sizeY - 1) / 2);
    return { rotateX, rotateY };
}

export default function DomeGallery({ images = DEFAULT_IMAGES }) {
    const sphereRef = useRef(null);
    const items = useMemo(() => buildItems(images, SEGMENTS), [images]);

    useEffect(() => {
        if (sphereRef.current) {
            sphereRef.current.style.transform = `rotateX(10deg) rotateY(0deg)`;
        }
    }, []);

    return (
        <div className="sphere-root">
            <main className="sphere-main">
                <div className="stage">
                    <div ref={sphereRef} className="sphere">
                        {items.map((it, i) => {
                            const { rotateX, rotateY } = computeItemRotation(it.x, it.y, it.sizeX, it.sizeY, SEGMENTS);
                            return (
                                <div
                                    key={i}
                                    className="item"
                                    style={{
                                        transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(${RADIUS}px)`,
                                    }}
                                >
                                    <div className="item__image">
                                        <img src={it.src} alt={it.alt} draggable={false} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
}
