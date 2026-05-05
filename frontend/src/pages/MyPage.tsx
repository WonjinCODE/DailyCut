import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  ExternalLink,
  Film,
  Save,
  Settings,
  Trash2,
} from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import {
  deleteMyInteraction,
  getMyInteractions,
  getMyOtts,
  getMyPreferences,
  updateMyInteraction,
  updateMyOtts,
  updateMyPreferences,
} from '../services/myPageService';
import type {
  GenreCode,
  InteractionType,
  MyInteractionItem,
  MyInteractionsResponse,
  OttCode,
} from '../types';
import { buildOttWatchLinks } from '../utils/ottSearchLinks';
import { useMediaQuery } from '../hooks/useMediaQuery';

type InteractionTab = 'like' | 'watched' | 'dislike';
type MobileMyPageSection = 'library' | 'otts' | 'genres';

const INTERACTION_TABS: Array<{
  key: InteractionTab;
  label: string;
  type: InteractionType;
}> = [
  { key: 'like', label: '볼거에요', type: 'LIKE' },
  { key: 'watched', label: '봤어요', type: 'WATCHED' },
  { key: 'dislike', label: '별로에요', type: 'DISLIKE' },
];

const INTERACTION_LABELS: Record<InteractionType, string> = {
  LIKE: '볼거에요',
  WATCHED: '봤어요',
  DISLIKE: '별로에요',
};

const OTT_OPTIONS: Array<{ code: OttCode; label: string }> = [
  { code: 'NETFLIX', label: 'Netflix' },
  { code: 'TVING', label: 'TVING' },
  { code: 'WAVVE', label: 'Wavve' },
  { code: 'DISNEY_PLUS', label: 'Disney+' },
  { code: 'WATCHA', label: 'Watcha' },
  { code: 'COUPANG_PLAY', label: 'Coupang Play' },
];

const GENRE_OPTIONS: Array<{ code: GenreCode; label: string }> = [
  { code: 'ACTION', label: '액션' },
  { code: 'COMEDY', label: '코미디' },
  { code: 'ROMANCE', label: '로맨스' },
  { code: 'THRILLER', label: '스릴러' },
  { code: 'SF', label: 'SF' },
  { code: 'FANTASY', label: '판타지' },
  { code: 'CRIME', label: '범죄' },
  { code: 'DOCUMENTARY', label: '다큐멘터리' },
  { code: 'ANIMATION', label: '애니메이션' },
  { code: 'DRAMA', label: '드라마' },
];

const emptyInteractions: MyInteractionsResponse = {
  like: [],
  watched: [],
  dislike: [],
};

function toggleValue<T extends string>(values: T[], value: T): T[] {
  return values.includes(value)
    ? values.filter((currentValue) => currentValue !== value)
    : [...values, value];
}

function openExternalUrl(url: string) {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  if (newWindow) {
    newWindow.opener = null;
  }
}

const MyPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<InteractionTab>('like');
  const [interactions, setInteractions] = useState<MyInteractionsResponse>(emptyInteractions);
  const [selectedOtts, setSelectedOtts] = useState<OttCode[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<GenreCode[]>([]);
  const [mobileSection, setMobileSection] = useState<MobileMyPageSection>('library');
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingOtts, setIsSavingOtts] = useState(false);
  const [isSavingGenres, setIsSavingGenres] = useState(false);
  const [pendingContentId, setPendingContentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useMediaQuery('(max-width: 767px)');

  const activeItems = interactions[activeTab] ?? [];

  const totalCount = useMemo(
    () => interactions.like.length + interactions.watched.length + interactions.dislike.length,
    [interactions]
  );

  const loadMyPageData = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [nextInteractions, nextOtts, nextGenres] = await Promise.all([
        getMyInteractions(),
        getMyOtts(),
        getMyPreferences(),
      ]);
      setInteractions(nextInteractions);
      setSelectedOtts(nextOtts);
      setSelectedGenres(nextGenres);
    } catch (requestError) {
      const message = requestError instanceof Error
        ? requestError.message
        : '마이페이지 데이터를 불러오지 못했습니다.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadMyPageData();
  }, [loadMyPageData]);

  const handleInteractionChange = async (contentId: string, nextType: InteractionType) => {
    try {
      setPendingContentId(contentId);
      await updateMyInteraction(contentId, nextType);
      await loadMyPageData();
      const nextTab = INTERACTION_TABS.find((tab) => tab.type === nextType)?.key;
      if (nextTab) {
        setActiveTab(nextTab);
      }
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : '반응 변경에 실패했습니다.';
      alert(message);
    } finally {
      setPendingContentId(null);
    }
  };

  const handleInteractionDelete = async (contentId: string) => {
    if (!window.confirm('이 콘텐츠의 반응 기록을 삭제할까요?')) {
      return;
    }

    try {
      setPendingContentId(contentId);
      await deleteMyInteraction(contentId);
      await loadMyPageData();
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : '반응 삭제에 실패했습니다.';
      alert(message);
    } finally {
      setPendingContentId(null);
    }
  };

  const handleSaveOtts = async () => {
    try {
      setIsSavingOtts(true);
      const savedOtts = await updateMyOtts(selectedOtts);
      setSelectedOtts(savedOtts);
      alert('구독 OTT 설정을 저장했습니다.');
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'OTT 설정 저장에 실패했습니다.';
      alert(message);
    } finally {
      setIsSavingOtts(false);
    }
  };

  const handleSaveGenres = async () => {
    try {
      setIsSavingGenres(true);
      const savedGenres = await updateMyPreferences(selectedGenres);
      setSelectedGenres(savedGenres);
      alert('선호 장르 설정을 저장했습니다.');
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : '장르 설정 저장에 실패했습니다.';
      alert(message);
    } finally {
      setIsSavingGenres(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <Loading fullScreen message="마이페이지 데이터를 불러오는 중..." />
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <section className="min-h-[70vh] flex items-center justify-center px-4">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-black text-white mb-3">마이페이지를 불러오지 못했어요</h1>
            <p className="text-slate-400 mb-6">{error}</p>
            <button
              type="button"
              onClick={loadMyPageData}
              className="px-5 py-3 rounded-lg bg-accent-red text-white text-sm font-bold hover:opacity-90 transition-opacity"
            >
              다시 시도하기
            </button>
          </div>
        </section>
      </MainLayout>
    );
  }

  if (isMobile) {
    return (
      <MobileMyPageView
        activeSection={mobileSection}
        activeTab={activeTab}
        interactions={interactions}
        activeItems={activeItems}
        selectedOtts={selectedOtts}
        selectedGenres={selectedGenres}
        pendingContentId={pendingContentId}
        isSavingOtts={isSavingOtts}
        isSavingGenres={isSavingGenres}
        onSectionChange={setMobileSection}
        onTabChange={setActiveTab}
        onOttsChange={setSelectedOtts}
        onGenresChange={setSelectedGenres}
        onSaveOtts={handleSaveOtts}
        onSaveGenres={handleSaveGenres}
        onInteractionChange={handleInteractionChange}
        onInteractionDelete={handleInteractionDelete}
      />
    );
  }

  return (
    <MainLayout>
      <section className="py-10 md:py-16 min-h-[80vh]">
        <div className="container-custom">
          <div className="mb-10">
            <p className="text-sm font-black uppercase tracking-widest text-accent-red mb-3">
              My Page
            </p>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              마이페이지
            </h1>
            <p className="mt-4 text-slate-400">
              내 추천 데이터를 관리하고, DailyCut 추천 설정을 직접 조정해보세요.
            </p>
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
            <section className="min-w-0">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-5">
                <div>
                  <h2 className="text-xl font-black text-white">내 콘텐츠 보관함</h2>
                  <p className="text-sm text-slate-500 mt-1">총 {totalCount}개의 반응 기록</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {INTERACTION_TABS.map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${
                        activeTab === tab.key
                          ? 'bg-accent-red text-white border-accent-red'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {tab.label} {interactions[tab.key].length}
                    </button>
                  ))}
                </div>
              </div>

              {activeItems.length > 0 ? (
                <div className="grid gap-4">
                  {activeItems.map((item) => (
                    <InteractionCard
                      key={item.contentId}
                      item={item}
                      selectedOtts={selectedOtts}
                      isPending={pendingContentId === item.contentId}
                      onChange={handleInteractionChange}
                      onDelete={handleInteractionDelete}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-white/10 bg-white/[0.03] py-12">
                  <EmptyState
                    title={`${INTERACTION_TABS.find((tab) => tab.key === activeTab)?.label} 콘텐츠가 없습니다`}
                    description="추천 카드에서 반응 버튼을 누르면 이곳에서 다시 관리할 수 있습니다."
                  />
                </div>
              )}
            </section>

            <aside className="space-y-6">
              <SettingsPanel
                title="구독 OTT 설정"
                description="저장한 OTT 기준으로 보관함의 검색 버튼이 표시됩니다."
                onSave={handleSaveOtts}
                isSaving={isSavingOtts}
              >
                <div className="grid grid-cols-2 gap-2">
                  {OTT_OPTIONS.map((ott) => (
                    <ToggleButton
                      key={ott.code}
                      label={ott.label}
                      active={selectedOtts.includes(ott.code)}
                      onClick={() => setSelectedOtts((currentOtts) => toggleValue(currentOtts, ott.code))}
                    />
                  ))}
                </div>
              </SettingsPanel>

              <SettingsPanel
                title="선호 장르 설정"
                description="선택 순서대로 저장되며 추천 선호 데이터로 사용할 수 있습니다."
                onSave={handleSaveGenres}
                isSaving={isSavingGenres}
              >
                <div className="flex flex-wrap gap-2">
                  {GENRE_OPTIONS.map((genre) => (
                    <ToggleButton
                      key={genre.code}
                      label={genre.label}
                      active={selectedGenres.includes(genre.code)}
                      onClick={() => setSelectedGenres((currentGenres) => toggleValue(currentGenres, genre.code))}
                    />
                  ))}
                </div>
              </SettingsPanel>
            </aside>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

interface MobileMyPageViewProps {
  activeSection: MobileMyPageSection;
  activeTab: InteractionTab;
  interactions: MyInteractionsResponse;
  activeItems: MyInteractionItem[];
  selectedOtts: OttCode[];
  selectedGenres: GenreCode[];
  pendingContentId: string | null;
  isSavingOtts: boolean;
  isSavingGenres: boolean;
  onSectionChange: (section: MobileMyPageSection) => void;
  onTabChange: (tab: InteractionTab) => void;
  onOttsChange: (otts: OttCode[]) => void;
  onGenresChange: (genres: GenreCode[]) => void;
  onSaveOtts: () => void;
  onSaveGenres: () => void;
  onInteractionChange: (contentId: string, nextType: InteractionType) => void;
  onInteractionDelete: (contentId: string) => void;
}

const MobileMyPageView = ({
  activeSection,
  activeTab,
  interactions,
  activeItems,
  selectedOtts,
  selectedGenres,
  pendingContentId,
  isSavingOtts,
  isSavingGenres,
  onSectionChange,
  onTabChange,
  onOttsChange,
  onGenresChange,
  onSaveOtts,
  onSaveGenres,
  onInteractionChange,
  onInteractionDelete,
}: MobileMyPageViewProps) => {
  const sectionTabs: Array<{ key: MobileMyPageSection; label: string }> = [
    { key: 'library', label: '보관함' },
    { key: 'otts', label: 'OTT 설정' },
    { key: 'genres', label: '장르 설정' },
  ];

  return (
    <MainLayout>
      <section className="min-h-[80vh] px-4 py-8 overflow-x-hidden">
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-widest text-accent-red mb-3">
            My Page
          </p>
          <h1 className="text-2xl font-black text-white">마이페이지</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            내 추천 데이터를 관리해보세요.
          </p>
        </div>

        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {sectionTabs.map((section) => (
            <button
              key={section.key}
              type="button"
              onClick={() => onSectionChange(section.key)}
              className={`min-h-11 shrink-0 rounded-xl border px-4 py-2 text-sm font-black ${
                activeSection === section.key
                  ? 'border-accent-red bg-accent-red text-white'
                  : 'border-white/10 bg-white/5 text-slate-300'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {activeSection === 'library' && (
          <div>
            <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
              {INTERACTION_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => onTabChange(tab.key)}
                  className={`min-h-10 shrink-0 rounded-xl border px-3 py-2 text-sm font-bold ${
                    activeTab === tab.key
                      ? 'border-white bg-white text-dark'
                      : 'border-white/10 bg-white/5 text-slate-300'
                  }`}
                >
                  {tab.label} {interactions[tab.key].length}
                </button>
              ))}
            </div>

            {activeItems.length > 0 ? (
              <div className="grid gap-4">
                {activeItems.map((item) => (
                  <MobileInteractionCard
                    key={item.contentId}
                    item={item}
                    selectedOtts={selectedOtts}
                    isPending={pendingContentId === item.contentId}
                    onChange={onInteractionChange}
                    onDelete={onInteractionDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <EmptyState
                  title={`${INTERACTION_TABS.find((tab) => tab.key === activeTab)?.label} 콘텐츠가 없습니다`}
                  description="추천 카드에서 반응을 남기면 이곳에 표시됩니다."
                />
              </div>
            )}
          </div>
        )}

        {activeSection === 'otts' && (
          <MobileSettingsBlock
            title="구독 OTT 설정"
            description="보관함 검색 버튼에 사용할 OTT를 골라주세요."
            isSaving={isSavingOtts}
            onSave={onSaveOtts}
          >
            <div className="grid grid-cols-2 gap-2">
              {OTT_OPTIONS.map((ott) => (
                <ToggleButton
                  key={ott.code}
                  label={ott.label}
                  active={selectedOtts.includes(ott.code)}
                  onClick={() => onOttsChange(toggleValue(selectedOtts, ott.code))}
                />
              ))}
            </div>
          </MobileSettingsBlock>
        )}

        {activeSection === 'genres' && (
          <MobileSettingsBlock
            title="선호 장르 설정"
            description="선택한 순서대로 선호 장르가 저장됩니다."
            isSaving={isSavingGenres}
            onSave={onSaveGenres}
          >
            <div className="flex flex-wrap gap-2">
              {GENRE_OPTIONS.map((genre) => (
                <ToggleButton
                  key={genre.code}
                  label={genre.label}
                  active={selectedGenres.includes(genre.code)}
                  onClick={() => onGenresChange(toggleValue(selectedGenres, genre.code))}
                />
              ))}
            </div>
          </MobileSettingsBlock>
        )}
      </section>
    </MainLayout>
  );
};

interface MobileSettingsBlockProps {
  title: string;
  description: string;
  isSaving: boolean;
  onSave: () => void;
  children: ReactNode;
}

const MobileSettingsBlock = ({
  title,
  description,
  isSaving,
  onSave,
  children,
}: MobileSettingsBlockProps) => (
  <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
    <h2 className="text-xl font-black text-white">{title}</h2>
    <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
    <div className="mt-5">{children}</div>
    <button
      type="button"
      onClick={onSave}
      disabled={isSaving}
      className="mt-6 min-h-12 w-full rounded-xl bg-accent-red px-4 text-base font-black text-white disabled:opacity-60"
    >
      {isSaving ? '저장 중...' : '저장'}
    </button>
  </section>
);

interface MobileInteractionCardProps {
  item: MyInteractionItem;
  selectedOtts: OttCode[];
  isPending: boolean;
  onChange: (contentId: string, nextType: InteractionType) => void;
  onDelete: (contentId: string) => void;
}

const MobileInteractionCard = ({
  item,
  selectedOtts,
  isPending,
  onChange,
  onDelete,
}: MobileInteractionCardProps) => {
  const watchLinks = buildOttWatchLinks(selectedOtts, item.title || '');

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
      <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 p-4">
        <div className="aspect-[2/3] overflow-hidden rounded-xl bg-black/30 border border-white/10">
          {item.posterUrl ? (
            <img
              src={item.posterUrl}
              alt={`${item.title} 포스터`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-slate-600">
              <Film size={26} />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase text-slate-500">
            {item.contentType || 'content'}
            {item.runtime ? ` · ${item.runtime}분` : ''}
          </p>
          <h3 className="mt-2 text-base font-black leading-tight text-white">
            {item.title || '제목 없음'}
          </h3>
          <p className="mt-2 text-xs font-bold text-accent-red">
            {INTERACTION_LABELS[item.interactionType]}
          </p>
        </div>
      </div>

      <div className="space-y-3 border-t border-white/10 p-4">
        {selectedOtts.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {watchLinks.map((watchLink) => (
              <button
                key={watchLink.providerCode}
                type="button"
                onClick={() => openExternalUrl(watchLink.url)}
                className="min-h-11 flex-1 rounded-xl border border-accent-red/20 bg-accent-red/10 px-3 text-sm font-black text-white"
              >
                {watchLink.providerName}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">구독 OTT를 먼저 설정해주세요.</p>
        )}

        <select
          value={item.interactionType}
          disabled={isPending}
          onChange={(event) => onChange(item.contentId, event.target.value as InteractionType)}
          className="min-h-11 w-full rounded-xl border border-white/10 bg-black/30 px-3 text-sm font-black text-white focus:border-accent-red focus:outline-none disabled:opacity-50"
          aria-label={`${item.title} 반응 변경`}
        >
          {INTERACTION_TABS.map((tab) => (
            <option key={tab.type} value={tab.type} className="bg-dark text-white">
              {tab.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          disabled={isPending}
          onClick={() => onDelete(item.contentId)}
          className="min-h-11 w-full rounded-xl border border-red-500/30 bg-red-500/10 px-4 text-sm font-black text-red-200 disabled:opacity-50"
        >
          반응 기록 삭제
        </button>
      </div>
    </article>
  );
};

interface InteractionCardProps {
  item: MyInteractionItem;
  selectedOtts: OttCode[];
  isPending: boolean;
  onChange: (contentId: string, nextType: InteractionType) => void;
  onDelete: (contentId: string) => void;
}

const InteractionCard = ({
  item,
  selectedOtts,
  isPending,
  onChange,
  onDelete,
}: InteractionCardProps) => {
  const watchLinks = buildOttWatchLinks(selectedOtts, item.title || '');

  return (
    <article className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-4 sm:grid-cols-[92px_minmax(0,1fr)]">
      <div className="aspect-[2/3] overflow-hidden rounded-md bg-black/30 border border-white/10">
        {item.posterUrl ? (
          <img
            src={item.posterUrl}
            alt={`${item.title} 포스터`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-slate-600">
            <Film size={28} />
          </div>
        )}
      </div>

      <div className="min-w-0 flex flex-col gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500 uppercase">
            <span>{item.contentType || 'content'}</span>
            {item.runtime ? (
              <>
                <span className="h-1 w-1 rounded-full bg-slate-600" />
                <span className="inline-flex items-center gap-1">
                  <Clock size={12} />
                  {item.runtime}분
                </span>
              </>
            ) : null}
          </div>
          <h3 className="mt-2 text-lg font-black text-white leading-tight">{item.title || '제목 없음'}</h3>
          <p className="mt-2 text-xs text-slate-500">
            현재 반응: {INTERACTION_LABELS[item.interactionType]}
            {item.genreIds?.length ? ` · 장르 ID ${item.genreIds.join(', ')}` : ''}
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={item.interactionType}
              disabled={isPending}
              onChange={(event) => onChange(item.contentId, event.target.value as InteractionType)}
              className="h-10 rounded-lg border border-white/10 bg-black/30 px-3 text-sm font-bold text-white focus:outline-none focus:border-accent-red disabled:opacity-50"
              aria-label={`${item.title} 반응 변경`}
            >
              {INTERACTION_TABS.map((tab) => (
                <option key={tab.type} value={tab.type} className="bg-dark text-white">
                  {tab.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              disabled={isPending}
              onClick={() => onDelete(item.contentId)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              <Trash2 size={15} />
              삭제
            </button>
          </div>

          {selectedOtts.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {watchLinks.map((watchLink) => (
                <button
                  key={watchLink.providerCode}
                  type="button"
                  onClick={() => openExternalUrl(watchLink.url)}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-accent-red/20 bg-accent-red/10 px-3 text-sm font-bold text-white hover:bg-accent-red/20"
                  title={`${watchLink.providerName}에서 ${item.title} 검색`}
                >
                  <ExternalLink size={14} />
                  {watchLink.providerName}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">구독 OTT를 먼저 설정해주세요.</p>
          )}
        </div>
      </div>
    </article>
  );
};

interface SettingsPanelProps {
  title: string;
  description: string;
  isSaving: boolean;
  onSave: () => void;
  children: ReactNode;
}

const SettingsPanel = ({
  title,
  description,
  isSaving,
  onSave,
  children,
}: SettingsPanelProps) => (
  <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
    <div className="mb-4">
      <div className="flex items-center gap-2 text-white">
        <Settings size={18} className="text-accent-red" />
        <h2 className="text-lg font-black">{title}</h2>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
    </div>

    {children}

    <button
      type="button"
      onClick={onSave}
      disabled={isSaving}
      className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent-red px-4 text-sm font-black text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Save size={16} />
      {isSaving ? '저장 중...' : '저장'}
    </button>
  </section>
);

interface ToggleButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const ToggleButton = ({ label, active, onClick }: ToggleButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`min-h-10 rounded-lg border px-3 py-2 text-sm font-bold transition-colors ${
      active
        ? 'border-accent-red bg-accent-red text-white'
        : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
    }`}
    aria-pressed={active}
  >
    {label}
  </button>
);

export default MyPage;
