interface PlaceholderPanelProps {
    icon: string;
    title: string;
    description?: string;
}

function PlaceholderPanel({ icon, title, description }: PlaceholderPanelProps) {
    return (
        <div className="account-placeholder">
            <i className={icon}></i>
            <h2>{title}</h2>
            <p>{description || "Chức năng đang được phát triển, vui lòng quay lại sau."}</p>
        </div>
    );
}

export default PlaceholderPanel;
