export default function OrderSuccess() {
  return (
    <section
      className="d-flex flex-column justify-content-center align-items-center text-center"
      style={{ height: "100vh" }}
    >
      <h2 className="text-success fw-bold mb-3">Order Placed Successfully 🎉</h2>
      <p className="mb-3">Your order has been confirmed. We will contact you soon.</p>

      <a href="/" className="btn btn-primary mt-3">
        Back to Home
      </a>
    </section>
  );
}