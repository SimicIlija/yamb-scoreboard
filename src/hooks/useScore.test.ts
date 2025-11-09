import { renderHook, act } from '@testing-library/react';
import useScore from './useScore';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});


describe('useScore', () => {
  beforeEach(() => {
    // Clear all localStorage mocks before each test
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();

    // Setup default mock returns
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should initialize with 0 stars and initial scores', () => {
    const { result } = renderHook(() => useScore());
    expect(result.current.stars).toBe(0);
    expect(result.current.scores.ones).toEqual(Array(6).fill(null));
  });

  it('should add a star', () => {
    const { result } = renderHook(() => useScore());
    act(() => {
      result.current.addStar();
    });
    expect(result.current.stars).toBe(1);
  });

  it('should remove a star', () => {
    const { result } = renderHook(() => useScore());
    act(() => {
      result.current.addStar();
    });
    act(() => {
      result.current.removeStar();
    });
    expect(result.current.stars).toBe(0);
  });

  it('should not remove a star if stars are 0', () => {
    const { result } = renderHook(() => useScore());
    act(() => {
      result.current.removeStar();
    });
    expect(result.current.stars).toBe(0);
  });

  it('should set active cell and submit score', () => {
    const { result } = renderHook(() => useScore());
    window.alert = jest.fn();

    // Set active cell
    act(() => {
      result.current.setActiveCell({ row: 'ones', index: 0 });
    });
    expect(result.current.activeCell).toEqual({ row: 'ones', index: 0 });

    // Submit score
    act(() => {
      result.current.handleScoreSubmit(1);
    });
    expect(result.current.scores.ones[0]).toBe(1);
    expect(result.current.activeCell).toBe(null); // Should close after submit
  });

  it('should accept score input for straight row (validation moved to component)', () => {
    const { result } = renderHook(() => useScore());

    // Set active cell
    act(() => {
      result.current.setActiveCell({ row: 'straight', index: 0 });
    });

    // Submit valid value (validation now happens in ScoreInput component)
    act(() => {
      result.current.handleScoreSubmit(46);
    });
    expect(result.current.scores.straight[0]).toBe(46);
    expect(result.current.activeCell).toBe(null);
  });

  it('should accept score input for trilling row (validation moved to component)', () => {
    const { result } = renderHook(() => useScore());

    // Set active cell
    act(() => {
      result.current.setActiveCell({ row: 'trilling', index: 0 });
    });

    // Submit valid value (validation now happens in ScoreInput component)
    act(() => {
      result.current.handleScoreSubmit(20);
    });
    expect(result.current.scores.trilling[0]).toBe(20);
    expect(result.current.activeCell).toBe(null);
  });

  it('should accept score input for full row (validation moved to component)', () => {
    const { result } = renderHook(() => useScore());

    // Set active cell
    act(() => {
      result.current.setActiveCell({ row: 'full', index: 0 });
    });

    // Submit valid value (validation now happens in ScoreInput component)
    act(() => {
      result.current.handleScoreSubmit(60);
    });
    expect(result.current.scores.full[0]).toBe(60);
    expect(result.current.activeCell).toBe(null);
  });

  it('should accept score input for poker row (validation moved to component)', () => {
    const { result } = renderHook(() => useScore());

    // Set active cell
    act(() => {
      result.current.setActiveCell({ row: 'poker', index: 0 });
    });

    // Submit valid value (validation now happens in ScoreInput component)
    act(() => {
      result.current.handleScoreSubmit(40);
    });
    expect(result.current.scores.poker[0]).toBe(40);
    expect(result.current.activeCell).toBe(null);
  });

  it('should accept score input for yamb row (validation moved to component)', () => {
    const { result } = renderHook(() => useScore());

    // Set active cell
    act(() => {
      result.current.setActiveCell({ row: 'yamb', index: 0 });
    });

    // Submit valid value (validation now happens in ScoreInput component)
    act(() => {
      result.current.handleScoreSubmit(50);
    });
    expect(result.current.scores.yamb[0]).toBe(50);
    expect(result.current.activeCell).toBe(null);
  });

  it('should reset all scores and stars to initial state', () => {
    const { result } = renderHook(() => useScore());
    window.alert = jest.fn();

    // Add some scores and stars
    act(() => {
      result.current.setActiveCell({ row: 'ones', index: 0 });
    });
    act(() => {
      result.current.handleScoreSubmit(5);
    });

    act(() => {
      result.current.addStar();
    });
    act(() => {
      result.current.addStar();
    });

    // Verify data was added
    expect(result.current.scores.ones[0]).toBe(5);
    expect(result.current.stars).toBe(2);

    // Reset everything
    act(() => {
      result.current.resetAll();
    });

    // Verify everything is back to initial state
    expect(result.current.scores.ones[0]).toBe(null);
    expect(result.current.scores.totalSum[0]).toBe(null);
    expect(result.current.stars).toBe(0);
    expect(result.current.calculateFinalResult()).toBe(0);
  });

  it('should save data to localStorage when scores or stars change', async () => {
    const { result } = renderHook(() => useScore());
    window.alert = jest.fn();

    // Wait for initial hydration
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Add a score
    act(() => {
      result.current.setActiveCell({ row: 'ones', index: 0 });
    });
    act(() => {
      result.current.handleScoreSubmit(5);
    });

    // Add a star
    act(() => {
      result.current.addStar();
    });

    // Verify localStorage.setItem was called
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'yamb-scores-1',
      expect.stringContaining('"ones":[5,null,null,null,null,null]')
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith('yamb-stars-1', '1');
  });

  it('should delete score from active cell', () => {
    const { result } = renderHook(() => useScore());
    window.alert = jest.fn();

    // First add a score
    act(() => {
      result.current.setActiveCell({ row: 'ones', index: 0 });
    });
    act(() => {
      result.current.handleScoreSubmit(5);
    });
    expect(result.current.scores.ones[0]).toBe(5);

    // Now delete it
    act(() => {
      result.current.setActiveCell({ row: 'ones', index: 0 });
    });
    act(() => {
      result.current.handleScoreDelete();
    });
    expect(result.current.scores.ones[0]).toBe(null);
    expect(result.current.activeCell).toBe(null); // Should close after delete
  });

  it('should load data from localStorage on initialization', () => {
    // Mock localStorage to return saved data
    const savedScores = {
      ones: [3, null, null, null, null, null],
      twos: [null, null, null, null, null, null],
      threes: [null, null, null, null, null, null],
      fours: [null, null, null, null, null, null],
      fives: [null, null, null, null, null, null],
      sixes: [null, null, null, null, null, null],
      sum1: [3, null, null, null, null, null],
      max: [null, null, null, null, null, null],
      min: [null, null, null, null, null, null],
      sum2: [null, null, null, null, null, null],
      trilling: [null, null, null, null, null, null],
      straight: [null, null, null, null, null, null],
      full: [null, null, null, null, null, null],
      poker: [null, null, null, null, null, null],
      yamb: [null, null, null, null, null, null],
      totalSum: [3, null, null, null, null, null]
    };

    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'yamb-scores-1') return JSON.stringify(savedScores);
      if (key === 'yamb-stars-1') return '2';
      return null;
    });

    const { result } = renderHook(() => useScore());

    // Verify data was loaded
    expect(result.current.scores.ones[0]).toBe(3);
    expect(result.current.stars).toBe(2);
  });

});
