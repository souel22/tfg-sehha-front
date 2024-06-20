// Feature Component
const Feature = ({ title, description, image }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", margin: "1rem 0" }}>
      <img
        src={image}
        alt={title}
        style={{ width: "100px", height: "100px", marginRight: "1rem" }}
      />
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default Feature;
