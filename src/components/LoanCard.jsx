import { Link } from "react-router-dom";

export default function LoanCard({ loan }) {
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
      <figure>
        <img
          src={loan.image}
          alt={loan.title}
          className="h-48 w-full object-cover"
        />
      </figure>

      <div className="card-body">
        <h2 className="card-title">{loan.title}</h2>
        <p>{loan.description?.slice(0, 70)}...</p>
        <p className="font-semibold">Max Limit: ${loan.max_limit}</p>

        <div className="card-actions justify-end">
          <Link to={`/loan/${loan._id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
