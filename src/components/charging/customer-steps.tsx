const steps = ["Select package", "Continue", "Pay", "Deposit", "Charge"];

export function CustomerSteps() {
  return (
    <ol className="grid grid-cols-5 gap-1" aria-label="Charging steps">
      {steps.map((step, index) => (
        <li key={step} className="grid gap-1 text-center">
          <span className="mx-auto grid size-8 place-items-center rounded-full border bg-card text-xs font-black">
            {index + 1}
          </span>
          <span className="text-[0.68rem] font-medium leading-tight text-muted-foreground">
            {step}
          </span>
        </li>
      ))}
    </ol>
  );
}
