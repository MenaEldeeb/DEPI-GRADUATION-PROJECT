import React from "react";

export default function PaymentModal({ show, total, method, onClose, onConfirm }) {
  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show"></div>

      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        style={{ background: "rgba(0,0,0,0.3)" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-3 shadow">

            <div className="modal-header">
              <h5 className="modal-title">Confirm Payment</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              <p className="mb-2 fw-semibold">
                Total Amount: <span className="text-success">${total.toFixed(2)}</span>
              </p>
              <p className="mb-0 fw-semibold">
                Payment Method: <span className="text-primary">{method}</span>
              </p>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-success" onClick={onConfirm}>
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

