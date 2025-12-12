import './ErrorMessage.css';

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <p className="error-text">{message || 'An error occurred'}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-retry">
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
