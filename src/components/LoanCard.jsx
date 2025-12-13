import { Link } from "react-router-dom";

const LoanCard = ({ loan }) => {
  const {
    _id,
    title,
    image,
    category,
    interest,
    maxAmount,
    shortDesc,
  } = loan;

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition">
      <figure>
        <img src={image} alt={title} className="h-48 w-full object-cover" />
      </figure>

      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p className="text-sm text-gray-500">{shortDesc}</p>

        <div className="text-sm mt-2 space-y-1">
          <p><strong>Category:</strong> {category}</p>
          <p><strong>Interest:</strong> {interest}%</p>
          <p><strong>Max Limit:</strong> ৳{maxAmount}</p>
        </div>

        <div className="card-actions justify-end mt-4">
          <Link to={`/loan/${_id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoanCard;
