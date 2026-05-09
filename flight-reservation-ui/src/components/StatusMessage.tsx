type Props = {
    loading: boolean;
    error: string;
    empty: boolean;
};

const StatusMessage = ({ loading, error, empty }: Props) => {
    if (loading) {
        return <div className="rounded-xl bg-white p-6 text-center shadow">Loading flights...</div>;
    }

    if (error) {
        return <div className="rounded-xl bg-red-100 p-6 text-red-700">{error}</div>;
    }

    if (empty) {
        return <div className="rounded-xl bg-white p-6 text-center text-gray-600 shadow">No flights found.</div>;
    }

    return null;
};

export default StatusMessage;