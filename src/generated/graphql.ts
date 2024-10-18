import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: number; output: number; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CourseClass = {
  __typename?: 'CourseClass';
  classMonitor: User;
  className: Scalars['String']['output'];
  courseName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lecturer: User;
  numberOfStudent: Scalars['Int']['output'];
  status: CourseClassStatus;
  students: Array<Maybe<User>>;
};

export type CourseClassFilter = {
  classMonitorName?: InputMaybe<Scalars['String']['input']>;
  className?: InputMaybe<Scalars['String']['input']>;
};

export enum CourseClassStatus {
  Close = 'CLOSE',
  Open = 'OPEN'
}

export type CreateCourseClassInput = {
  className?: InputMaybe<Scalars['String']['input']>;
  courseName?: InputMaybe<Scalars['String']['input']>;
  emailClassMonitor?: InputMaybe<Scalars['String']['input']>;
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  message: Scalars['String']['output'];
  token?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createCourseClass?: Maybe<Response>;
  deleteCourseClass?: Maybe<Response>;
  editProfile?: Maybe<Response>;
  joinOpenCourseClass?: Maybe<Response>;
  leaveCourseClass?: Maybe<Response>;
  login?: Maybe<LoginResponse>;
  logout?: Maybe<Response>;
  signUp?: Maybe<Response>;
  updateCourseClass?: Maybe<Response>;
};


export type MutationCreateCourseClassArgs = {
  createCourseClassInput: CreateCourseClassInput;
};


export type MutationDeleteCourseClassArgs = {
  id: Scalars['ID']['input'];
};


export type MutationEditProfileArgs = {
  userUpdateInput: UserUpdateInput;
};


export type MutationJoinOpenCourseClassArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLeaveCourseClassArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationSignUpArgs = {
  userInput: UserInput;
};


export type MutationUpdateCourseClassArgs = {
  id: Scalars['ID']['input'];
  updateCourseClassInput: UpdateCourseClassInput;
};

export type Query = {
  __typename?: 'Query';
  courseClass?: Maybe<CourseClass>;
  lecturerCourseClasses?: Maybe<Array<Maybe<CourseClass>>>;
  openCourseClasses?: Maybe<Array<Maybe<CourseClass>>>;
  profile?: Maybe<User>;
  studentCourseClasses?: Maybe<Array<Maybe<CourseClass>>>;
};


export type QueryCourseClassArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLecturerCourseClassesArgs = {
  filter?: InputMaybe<CourseClassFilter>;
};

export type Response = {
  __typename?: 'Response';
  message: Scalars['String']['output'];
};

export type UpdateCourseClassInput = {
  className?: InputMaybe<Scalars['String']['input']>;
  courseName?: InputMaybe<Scalars['String']['input']>;
  emailClassMonitor?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<CourseClassStatus>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  role: UserRole;
};

export type UserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<UserRole>;
};

export enum UserRole {
  Lecturer = 'LECTURER',
  Student = 'STUDENT'
}

export type UserUpdateInput = {
  fullName?: InputMaybe<Scalars['String']['input']>;
  newPassword?: InputMaybe<Scalars['String']['input']>;
  oldPassword?: InputMaybe<Scalars['String']['input']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CourseClass: ResolverTypeWrapper<CourseClass>;
  CourseClassFilter: CourseClassFilter;
  CourseClassStatus: CourseClassStatus;
  CreateCourseClassInput: CreateCourseClassInput;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  LoginResponse: ResolverTypeWrapper<LoginResponse>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Response: ResolverTypeWrapper<Response>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UpdateCourseClassInput: UpdateCourseClassInput;
  User: ResolverTypeWrapper<User>;
  UserInput: UserInput;
  UserRole: UserRole;
  UserUpdateInput: UserUpdateInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  CourseClass: CourseClass;
  CourseClassFilter: CourseClassFilter;
  CreateCourseClassInput: CreateCourseClassInput;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  LoginResponse: LoginResponse;
  Mutation: {};
  Query: {};
  Response: Response;
  String: Scalars['String']['output'];
  UpdateCourseClassInput: UpdateCourseClassInput;
  User: User;
  UserInput: UserInput;
  UserUpdateInput: UserUpdateInput;
};

export type CourseClassResolvers<ContextType = any, ParentType extends ResolversParentTypes['CourseClass'] = ResolversParentTypes['CourseClass']> = {
  classMonitor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  className?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  courseName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lecturer?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  numberOfStudent?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['CourseClassStatus'], ParentType, ContextType>;
  students?: Resolver<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LoginResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginResponse'] = ResolversParentTypes['LoginResponse']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createCourseClass?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, RequireFields<MutationCreateCourseClassArgs, 'createCourseClassInput'>>;
  deleteCourseClass?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, RequireFields<MutationDeleteCourseClassArgs, 'id'>>;
  editProfile?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, RequireFields<MutationEditProfileArgs, 'userUpdateInput'>>;
  joinOpenCourseClass?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, RequireFields<MutationJoinOpenCourseClassArgs, 'id'>>;
  leaveCourseClass?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, RequireFields<MutationLeaveCourseClassArgs, 'id'>>;
  login?: Resolver<Maybe<ResolversTypes['LoginResponse']>, ParentType, ContextType, RequireFields<MutationLoginArgs, 'email' | 'password'>>;
  logout?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType>;
  signUp?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, RequireFields<MutationSignUpArgs, 'userInput'>>;
  updateCourseClass?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, RequireFields<MutationUpdateCourseClassArgs, 'id' | 'updateCourseClassInput'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  courseClass?: Resolver<Maybe<ResolversTypes['CourseClass']>, ParentType, ContextType, RequireFields<QueryCourseClassArgs, 'id'>>;
  lecturerCourseClasses?: Resolver<Maybe<Array<Maybe<ResolversTypes['CourseClass']>>>, ParentType, ContextType, Partial<QueryLecturerCourseClassesArgs>>;
  openCourseClasses?: Resolver<Maybe<Array<Maybe<ResolversTypes['CourseClass']>>>, ParentType, ContextType>;
  profile?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  studentCourseClasses?: Resolver<Maybe<Array<Maybe<ResolversTypes['CourseClass']>>>, ParentType, ContextType>;
};

export type ResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['Response'] = ResolversParentTypes['Response']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fullName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['UserRole'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  CourseClass?: CourseClassResolvers<ContextType>;
  LoginResponse?: LoginResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Response?: ResponseResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

