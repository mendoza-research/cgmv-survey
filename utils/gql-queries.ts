import { gql } from "@apollo/client";

export const LATEST_TREATMENT_QUERY = gql`
  query LatestTreatmentsQuery {
    cgmv_sessions(limit: 1, order_by: { start_time: desc }) {
      financial_information
      gamification
    }
  }
`;

export const CREATE_CGMV_SESSION_QUERY = gql`
  mutation CreateSession(
    $os: String!
    $device_type: String!
    $browser_name: String!
    $browser_version: String!
    $ip_addr: inet!
    $gamification: String!
    $financial_information: String!
    $screen_resolution: String!
  ) {
    insert_cgmv_sessions(
      objects: {
        browser_name: $browser_name
        browser_version: $browser_version
        device_type: $device_type
        os: $os
        ip_addr: $ip_addr
        gamification: $gamification
        financial_information: $financial_information
        screen_resolution: $screen_resolution
      }
    ) {
      affected_rows
      returning {
        session_id
      }
    }
  }
`;

export const RECORD_PAGE_ENTER_QUERY = gql`
  mutation RecordPageEnter($session_id: uuid, $pathname: String) {
    insert_cgmv_navigations(
      objects: { session_id: $session_id, pathname: $pathname }
    ) {
      affected_rows
    }
  }
`;

export const RECORD_PAGE_EXIT_QUERY = gql`
  mutation RecordPageExit($session_id: uuid, $pathname: String) {
    update_cgmv_navigations(
      where: {
        _and: { session_id: { _eq: $session_id }, pathname: { _eq: $pathname } }
      }
      _set: { exit_time: "now" }
    ) {
      affected_rows
    }
  }
`;

export function getSingleQuestionUpdateQuery(fieldName: string) {
  return gql`
  mutation RecordSingleResponse($session_id: uuid!, $response_num: Int!, $response_text: String) {
    update_cgmv_sessions_by_pk(
      pk_columns: { session_id: $session_id }
      _set: {
        ${fieldName.concat("_num")}: $response_num,
        ${fieldName.concat("_text")}: $response_text,
      }
    ) {
      session_id
    }
  }
`;
}

export const UPDATE_INVEST_AMOUNTS_QUERY = gql`
  mutation RecordInvestAmounts(
    $session_id: uuid!
    $soundwaves_amount: numeric!
    $virtuoso_amount: numeric!
  ) {
    update_cgmv_sessions_by_pk(
      pk_columns: { session_id: $session_id }
      _set: {
        soundwaves_amount: $soundwaves_amount
        virtuoso_amount: $virtuoso_amount
      }
    ) {
      session_id
    }
  }
`;

export const RECORD_KNOWLEDGE_ITEM_CLICKS_QUERY = gql`
  mutation RecordKnowledgeItemClicks(
    $session_id: uuid!
    $click_EPS: Boolean!
    $click_PE_ratio: Boolean!
    $click_debt_ratio: Boolean!
    $click_fiscal_year: Boolean!
    $click_market_cap: Boolean!
    $click_gross_margin: Boolean!
    $click_net_income: Boolean!
    $click_stock_split: Boolean!
  ) {
    update_cgmv_sessions_by_pk(
      pk_columns: { session_id: $session_id }
      _set: {
        click_EPS: $click_EPS
        click_PE_ratio: $click_PE_ratio
        click_debt_ratio: $click_debt_ratio
        click_fiscal_year: $click_fiscal_year
        click_market_cap: $click_market_cap
        click_gross_margin: $click_gross_margin
        click_net_income: $click_net_income
        click_stock_split: $click_stock_split
      }
    ) {
      session_id
    }
  }
`;

export const RECORD_PLATFORM_QUESTIONS_QUERY = gql`
  mutation RecordSingleResponse(
    $session_id: uuid!
    $risk_recollection: String!
    $overall_experience: Int!
  ) {
    update_cgmv_sessions_by_pk(
      pk_columns: { session_id: $session_id }
      _set: {
        risk_recollection: $risk_recollection
        overall_experience: $overall_experience
      }
    ) {
      session_id
    }
  }
`;

export const RECORD_FIRST_EXIT_SURVEY_QUERY = gql`
  mutation RecordSingleResponse(
    $session_id: uuid!
    $attention_check: Int!
    $need_to_accomplish: Int!
    $strive_for_accomplishment: Int!
    $motivates_progress: Int!
    $time_pass_quickly: Int!
    $grabs_attention: Int!
    $lose_myself: Int!
    $playful_experience: Int!
    $feel_like_exploring_things: Int!
    $want_to_know_next: Int!
  ) {
    update_cgmv_sessions_by_pk(
      pk_columns: { session_id: $session_id }
      _set: {
        attention_check: $attention_check
        need_to_accomplish: $need_to_accomplish
        strive_for_accomplishment: $strive_for_accomplishment
        motivates_progress: $motivates_progress
        time_pass_quickly: $time_pass_quickly
        grabs_attention: $grabs_attention
        lose_myself: $lose_myself
        playful_experience: $playful_experience
        feel_like_exploring_things: $feel_like_exploring_things
        want_to_know_next: $want_to_know_next
      }
    ) {
      session_id
    }
  }
`;
