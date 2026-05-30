// src/features/collection/components/forms/EditCasing.tsx

// import CollectionPage from "../../page/CollectionPage";
import CollectionPage from "../../page/CollectionPage";

type Props = {
  casing: any;
  onClose: () => void;
  onSave: () => void;
};

const EditCasing = ({
  casing,
  onClose,
  onSave,
}: Props) => {
  return (
    <CollectionPage
      editMode={true}
      casing={casing}
      onClose={onClose}
      onSuccess={onSave}
      hideLayout={true}
    />
  );
};

export default EditCasing;