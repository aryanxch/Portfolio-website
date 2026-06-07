interface ExperienceItemProps {
  title: string;
  company: string;
  period: string;
  description: string;
}

const ExperienceItem = ({ title, company, period, description }: ExperienceItemProps) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-4">
        <div className="min-w-0">
          <h4 className="text-base font-medium">{title}</h4>
          <p className="text-sm text-muted-foreground">{company}</p>
        </div>
        <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap shrink-0">
          {period}
        </span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default ExperienceItem;