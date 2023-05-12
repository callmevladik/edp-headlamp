import { React } from '../../../../../../plugin.globals';
import { AutotestWithBranchesOption, QualityGate } from '../../types';

export interface QualityGateRowProps {
    autotestsWithBranchesOptions: AutotestWithBranchesOption[];
    currentQualityGateData: QualityGate;
    setNewQualityGates: (newQualityGates: QualityGate[]) => void;
    qualityGates: QualityGate[];
    setQualityGates: React.Dispatch<React.SetStateAction<QualityGate[]>>;
}
