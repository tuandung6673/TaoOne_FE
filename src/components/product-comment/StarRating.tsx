import classes from "./StarRating.module.scss";

interface StarRatingProps {
    value: number;
    size?: number;
}

const STARS = [1, 2, 3, 4, 5];

function StarRating({ value, size = 14 }: StarRatingProps) {
    const filled = Math.round(value);

    return (
        <span className={classes.stars} style={{ fontSize: size }}>
            {STARS.map((n) => (
                <i
                    key={n}
                    className={`pi ${n <= filled ? `pi-star-fill ${classes.filled}` : `pi-star ${classes.empty}`}`}
                />
            ))}
        </span>
    );
}

export default StarRating;
