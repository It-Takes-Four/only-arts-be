import { Expose } from 'class-transformer';

export class NestedResource {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

export class NestedResourceWithCode extends NestedResource {
  @Expose()
  code: string;
}

export class NestedHospitalResource extends NestedResource {
  @Expose()
  city: string;

  @Expose()
  location: string;
}

export class NestedPositionResource extends NestedResource {
  @Expose()
  isApproval?: boolean | null;
}

export class NestedCountResource {
  @Expose()
  responsibleAssets: number;
}