"use client";

import SubscriptionFormWrapper from "@/components/form/subscription/subscription-form-wrapper";
import CustomModal from "@/components/global/custom-modal";
import { useModal } from "@/lib/providers/modal-provider";
import { PricesList } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

type Props = {
  prices: PricesList["data"];
  customerId: string;
  planExists: boolean;
};
const SubscriptionHelper = ({ customerId, planExists, prices }: Props) => {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const { setOpen } = useModal();

  useEffect(() => {
    if (plan) {
      setOpen(
        <CustomModal
          title="Upgrade Plan"
          subheading="Get Started today to get access to premium features"
        >
          <SubscriptionFormWrapper
            planExists={planExists}
            customerId={customerId}
          />
        </CustomModal>,
        async () => ({
          plans: { defaultPriceId: plan ? plan : "", plans: prices },
        })
      );
    }
  }, [plan]);

  return <div>SubscriptionHelper</div>;
};
export default SubscriptionHelper;
