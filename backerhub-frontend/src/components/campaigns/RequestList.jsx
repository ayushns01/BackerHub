import RequestCard from "./RequestCard";

export default function RequestList({ campaignAddress, requestsCount }) {
  // Create an array from 0 to requestsCount-1 to map over
  const requestIds = Array.from(Array(requestsCount).keys());

  return (
    <div className="space-y-4">
      {requestIds.length > 0 ? (
        requestIds
          .map((id) => (
            <RequestCard
              key={id}
              campaignAddress={campaignAddress}
              requestId={id}
            />
          ))
          .reverse() // Show newest requests first
      ) : (
        <p className="text-gray-500 text-center">
          No spending requests have been made yet.
        </p>
      )}
    </div>
  );
}
