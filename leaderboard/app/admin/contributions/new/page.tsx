import ContributionForm from "@/components/admin/ContributionForm";

export default function NewContributionPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Nueva contribución
      </h1>
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <ContributionForm />
      </div>
    </div>
  );
}
