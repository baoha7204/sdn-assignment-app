import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <section>
      <h1>Unauthorized</h1>
      <br />
      <p>You do not have access to the requested page.</p>
      <div>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    </section>
  );
};

export default UnauthorizedPage;
